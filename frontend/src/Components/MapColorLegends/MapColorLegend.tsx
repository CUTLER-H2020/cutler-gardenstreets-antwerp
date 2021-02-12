import React from 'react';
import { Card, Tooltip } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { formatNumber } from '../../utils/format';
import { unitConfigs } from '../../utils/units';

interface IMapColorsLegend {
  title: string;
  legend: any[];
  unitId: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing(1),
      margin: theme.spacing(1),
      boxShadow: 'none',
    },
    colorBlock: {
      display: 'block',
      width: '24px',
      height: '24px',
    },
    legendTitle: {
      margin: '0',
    },
    legendBlocks: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    legendBlock: {
      width: '24px',
    },
    legendTexts: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    legendText: {
      margin: '2px 0px 4px',
    },
  }),
);

function MapColorLegend({ title, legend, unitId }: IMapColorsLegend) {
  const classes = useStyles();

  // @ts-ignore
  const unit = unitConfigs[unitId];
  const formatValue = (unit && unit.format) || formatNumber;

  return (
    <Card className={classes.container}>
      <h5 className={classes.legendTitle}>
        {title}
        {unit && ` (${unit.label})`}
      </h5>
      <div className={classes.legendTexts}>
        <p className={classes.legendText}>{formatValue(legend[0].value)}</p>
        <p className={classes.legendText}>
          {formatValue(legend[legend.length - 1].value)}
        </p>
      </div>
      <div className={classes.legendBlocks}>
        {legend.map((item, i) => {
          return (
            <Tooltip
              className={classes.legendBlock}
              key={i}
              title={formatValue(item.value)}
              aria-label={formatValue(item.value)}
            >
              <div
                style={{ backgroundColor: item.color }}
                className={classes.colorBlock}
              ></div>
            </Tooltip>
          );
        })}
      </div>
    </Card>
  );
}

export default MapColorLegend;
