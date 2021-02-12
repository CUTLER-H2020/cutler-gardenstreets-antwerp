import { orderBy as _orderBy } from 'lodash';
import { CircularProgress, IconButton } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Fab from '@material-ui/core/Fab';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import RoomIcon from '@material-ui/icons/Room';
import { navigate } from '@reach/router';
import React, { useEffect, useMemo, useState } from 'react';

import { Tuinstraat } from '../../../models/Tuinstraat';
import { formatEligible, formatNumber } from '../../../utils/format';
import GardenStreetsContainer from '../../../stateContainers/gardenStreets';
import useGardenStreetActions from '../../../hooks/useGardenStreetActions';

const useStyles = makeStyles((theme) => ({
  // we use a min height so that it is not tiny when loading
  rootContainer: {
    position: 'relative',
    width: '100%',
    minHeight: 435,
  },
  centeredContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addGardenStreetButton: {
    position: 'absolute',
    top: theme.spacing(3),
    right: theme.spacing(3),
  },
  filter: {
    margin: theme.spacing(2),
  },
  iconButton: {
    margin: theme.spacing(0),
    padding: theme.spacing(1),
  },
}));

interface EligibilityStatusProps {
  prefix: string;
  status: boolean | null;
}

function EligibilityStatus({ prefix, status }: EligibilityStatusProps) {
  const theme = useTheme();
  let color = theme.palette.grey[400];
  if (status === true) {
    color = theme.palette.success.main;
  }
  if (status === false) {
    color = theme.palette.error.main;
  }
  return (
    <Tooltip title={`${prefix}: ${formatEligible(status)}`}>
      <div
        style={{
          display: 'inline-block',
          width: 10,
          height: 10,
          margin: 4,
          borderRadius: 10,
          background: color,
        }}
      />
    </Tooltip>
  );
}

type OrderDirection = 'asc' | 'desc';

interface SortableTableHeadProps {
  orderBy: string;
  orderDirection: OrderDirection;
  onRequestSort: (
    orderBy: keyof Tuinstraat,
    orderDirection: OrderDirection,
  ) => void;
}

interface HeadCell {
  id: keyof Tuinstraat | 'actions';
  label: string;
  numeric: boolean;
  tooltipText?: string;
}

function SortableTableHead(props: SortableTableHeadProps) {
  const { orderBy, orderDirection, onRequestSort } = props;
  const headCells: HeadCell[] = [
    { id: 'name', label: 'Garden Street Name', numeric: false },
    { id: 'area', label: 'Area (m²)', numeric: true },
    { id: 'eligibleType1', label: 'Eligible', numeric: true },
    {
      id: 'benefitsType1',
      label: 'Ben. 1 (€)',
      numeric: true,
      tooltipText: 'Benefits Type 1',
    },
    {
      id: 'costsType1',
      label: 'Costs 1 (€)',
      numeric: true,
      tooltipText: 'Costs Type 1',
    },
    {
      id: 'profitsType1',
      label: 'Prof. 1 (€)',
      numeric: true,
      tooltipText: 'Profits Type 1',
    },
    {
      id: 'benefitsType2',
      label: 'Ben. 2 (€)',
      numeric: true,
      tooltipText: 'Benefits Type 2',
    },
    {
      id: 'costsType2',
      label: 'Costs 2 (€)',
      numeric: true,
      tooltipText: 'Costs Type 2',
    },
    {
      id: 'profitsType2',
      label: 'Prof. 2 (€)',
      numeric: true,
      tooltipText: 'Profits Type 2',
    },
    {
      id: 'benefitsType3',
      label: 'Ben. 3 (€)',
      numeric: true,
      tooltipText: 'Benefits Type 3',
    },
    {
      id: 'costsType3',
      label: 'Costs 3 (€)',
      numeric: true,
      tooltipText: 'Costs Type 3',
    },
    {
      id: 'profitsType3',
      label: 'Prof. 3 (€)',
      numeric: true,
      tooltipText: 'Profits Type 3',
    },
    { id: 'actions', label: '', numeric: true },
  ];
  return (
    <TableHead>
      <TableRow>
        {headCells.map((el) => (
          <TableCell key={el.id} align={el.numeric ? 'right' : 'left'}>
            <TableSortLabel
              active={el.id === orderBy}
              direction={el.id === orderBy ? orderDirection : 'asc'}
              onClick={() => {
                if (el.id !== 'actions') {
                  if (el.id === orderBy && orderDirection === 'asc') {
                    onRequestSort(el.id, 'desc');
                  } else {
                    onRequestSort(el.id, 'asc');
                  }
                }
              }}
            >
              <Tooltip title={el.tooltipText || ''}>
                <div>{el.label}</div>
              </Tooltip>
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function TuinstratenTable() {
  const classes = useStyles();

  const {
    loading: loadingGardenStreets,
    gardenStreets,
    setHighlightedGardenStreetId,
  } = GardenStreetsContainer.useContainer();

  const {
    deleteGardenStreet,
    editGardenStreet,
    selectGardenStreet,
  } = useGardenStreetActions();

  const [nItemsPage, setNItemsPage] = useState(5);
  const [pageIndex, setPageIndex] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [orderBy, setOrderBy] = useState('name');
  const [orderDirection, setOrderDirection] = useState<OrderDirection>('asc');

  const filteredGardenStreets = useMemo(
    () => gardenStreets.filter((street) => street.name.includes(searchText)),
    [gardenStreets, searchText],
  );

  // we sort by id in case of ties in order to have a deterministic sort result
  const orderedGardenStreets = useMemo(
    () =>
      _orderBy(
        filteredGardenStreets,
        [orderBy, 'id'],
        [orderDirection, orderDirection],
      ),
    [filteredGardenStreets, orderBy, orderDirection],
  );

  useEffect(() => setPageIndex(0), [nItemsPage]);

  if (loadingGardenStreets) {
    return (
      <Box className={`${classes.rootContainer} ${classes.centeredContainer}`}>
        <CircularProgress />
      </Box>
    );
  }

  // pagination
  const nItems = filteredGardenStreets.length;
  const displayedGardenStreets = orderedGardenStreets.slice(
    pageIndex * nItemsPage,
    (pageIndex + 1) * nItemsPage,
  );

  return (
    <Box className={classes.rootContainer}>
      <Fab
        className={classes.addGardenStreetButton}
        color="primary"
        size="small"
        aria-label="add"
        onClick={() => navigate('/garden-streets/new')}
      >
        <AddIcon />
      </Fab>

      <TextField
        className={classes.filter}
        label="Filter on name"
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
      />
      <TableContainer>
        <Table size="small" aria-label="simple table">
          <SortableTableHead
            orderBy={orderBy}
            orderDirection={orderDirection}
            onRequestSort={(orderBy, orderDirection) => {
              setOrderBy(orderBy);
              setOrderDirection(orderDirection);
            }}
          />

          <TableBody>
            {displayedGardenStreets.map((row) => (
              <TableRow
                hover
                key={row.id}
                onMouseEnter={() => setHighlightedGardenStreetId(row.id)}
                onMouseLeave={() => setHighlightedGardenStreetId('')}
              >
                <TableCell align="left" component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{formatNumber(row.area)}</TableCell>
                <TableCell align="right">
                  <EligibilityStatus
                    prefix="Type 1"
                    status={row.eligibleType1}
                  />
                  <EligibilityStatus
                    prefix="Type 2"
                    status={row.eligibleType2}
                  />
                  <EligibilityStatus
                    prefix="Type 3"
                    status={row.eligibleType3}
                  />
                </TableCell>
                <TableCell align="right">
                  {formatNumber(row.benefitsType1)}
                </TableCell>
                <TableCell align="right">
                  {formatNumber(row.costsType1)}
                </TableCell>
                <TableCell align="right">
                  {formatNumber(row.profitsType1)}
                </TableCell>
                <TableCell align="right">
                  {formatNumber(row.benefitsType2)}
                </TableCell>
                <TableCell align="right">
                  {formatNumber(row.costsType2)}
                </TableCell>
                <TableCell align="right">
                  {formatNumber(row.profitsType2)}
                </TableCell>
                <TableCell align="right">
                  {formatNumber(row.benefitsType3)}
                </TableCell>
                <TableCell align="right">
                  {formatNumber(row.costsType3)}
                </TableCell>
                <TableCell align="right">
                  {formatNumber(row.profitsType3)}
                </TableCell>
                <TableCell size="small" align="right">
                  <IconButton
                    className={classes.iconButton}
                    aria-label="room"
                    onClick={() => selectGardenStreet(row.id)}
                  >
                    <RoomIcon />
                  </IconButton>
                  <IconButton
                    className={classes.iconButton}
                    aria-label="edit"
                    onClick={() => editGardenStreet(row.id)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    className={classes.iconButton}
                    aria-label="delete"
                    onClick={() => deleteGardenStreet(row.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        rowsPerPageOptions={[nItemsPage]}
        rowsPerPage={nItemsPage}
        page={pageIndex}
        count={nItems}
        onChangePage={(_, page) => setPageIndex(page)}
        onChangeRowsPerPage={(event) =>
          setNItemsPage(parseInt(event.target.value, 10))
        }
      />
    </Box>
  );
}
