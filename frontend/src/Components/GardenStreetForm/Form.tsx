import { size } from 'lodash';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState } from 'react';

import { FormGardenStreet } from '../../models/Tuinstraat';
import { formatEligible } from '../../utils/format';

type ValidationErrors<T> = {
  [P in keyof T]?: string;
};

interface FormProps {
  values: FormGardenStreet;
  errors: ValidationErrors<FormGardenStreet>;
  updateValue: (key: string, value: any) => void;
  onCancel: () => void;
  onSubmit: () => Promise<void>;
}

interface EligibilityConfigItem {
  fieldName: 'eligibleType1' | 'eligibleType2' | 'eligibleType3';
  label: string;
}

const ELIGIBILITY_CONFIG = [
  { fieldName: 'eligibleType1', label: 'Type 1' },
  { fieldName: 'eligibleType2', label: 'Type 2' },
  { fieldName: 'eligibleType3', label: 'Type 3' },
] as EligibilityConfigItem[];

const rotateEligibilityStatus = (currentStatus: boolean | null) => {
  if (currentStatus === null) {
    return true;
  } else if (currentStatus === true) {
    return false;
  } else if (currentStatus === false) {
    return null;
  }
};

const VARIANT = 'standard';

const useStyles = makeStyles((theme) => ({
  formActions: {
    marginTop: theme.spacing(4),
  },
  actionButtonContainer: {
    '&:not(:last-child)': {
      marginRight: theme.spacing(2),
    },
  },
}));

function Form({ values, errors, updateValue, onCancel, onSubmit }: FormProps) {
  const classes = useStyles();
  const validationErrors = size(errors) > 0;
  const [isSubmitting, setIsSubmitting] = useState(false);
  return (
    <form>
      <TextField
        variant={VARIANT}
        margin="dense"
        fullWidth
        id="name"
        label="Name"
        value={values.name}
        onChange={(e) => updateValue('name', e.target.value)}
        error={errors.name !== undefined}
        helperText={errors.name}
      />

      <FormControl
        margin="dense"
        variant={VARIANT}
        fullWidth
        error={errors.status !== undefined}
      >
        <InputLabel id="status">Status</InputLabel>
        <Select
          id="status"
          labelId="status"
          value={values.status}
          onChange={(e) => updateValue('status', e.target.value)}
        >
          <MenuItem value="proposed">Proposed</MenuItem>
          <MenuItem value="existing">Existing</MenuItem>
        </Select>
        <FormHelperText>{errors.status}</FormHelperText>
      </FormControl>

      <FormControl
        margin="dense"
        variant={VARIANT}
        fullWidth
        error={errors.type !== undefined}
      >
        <InputLabel id="type">Type</InputLabel>
        <Select
          id="type"
          labelId="type"
          value={values.type}
          onChange={(e) => updateValue('type', e.target.value)}
        >
          <MenuItem value="Type 1">Type 1</MenuItem>
          <MenuItem value="Type 2">Type 2</MenuItem>
          <MenuItem value="Type 3">Type 3</MenuItem>
        </Select>
        <FormHelperText>{errors.type}</FormHelperText>
      </FormControl>

      <FormControl
        margin="dense"
        variant={VARIANT}
        fullWidth
        error={
          errors.eligibleType1 !== undefined ||
          errors.eligibleType2 !== undefined ||
          errors.eligibleType3 !== undefined
        }
      >
        <FormLabel component="legend">Eligibility</FormLabel>
        <FormGroup aria-label="position" row>
          {ELIGIBILITY_CONFIG.map((el) => {
            const currentStatus = values[el.fieldName];
            return (
              <Tooltip title={formatEligible(currentStatus)}>
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      checked={currentStatus === true}
                      indeterminate={currentStatus === null}
                      onChange={() => {
                        const nextValue = rotateEligibilityStatus(
                          currentStatus,
                        );
                        updateValue(el.fieldName, nextValue);
                      }}
                    />
                  }
                  label={el.label}
                />
              </Tooltip>
            );
          })}
        </FormGroup>
        <FormHelperText>
          {errors.eligibleType1 || errors.eligibleType2 || errors.eligibleType3}
        </FormHelperText>
      </FormControl>

      <TextField
        variant={VARIANT}
        margin="dense"
        fullWidth
        multiline
        rowsMax={4}
        id="evaluation"
        label="Evaluation"
        value={values.evaluation}
        onChange={(e) => updateValue('evaluation', e.target.value)}
        error={errors.evaluation !== undefined}
        helperText={errors.evaluation}
      />

      <TextField
        variant={VARIANT}
        margin="dense"
        fullWidth
        multiline
        rowsMax={4}
        id="remarks"
        label="Remarks"
        value={values.remarks}
        onChange={(e) => updateValue('remarks', e.target.value)}
        error={errors.remarks !== undefined}
        helperText={errors.remarks}
      />

      <FormControl
        margin="dense"
        variant={VARIANT}
        fullWidth
        error={errors.geometry !== undefined}
      >
        <FormHelperText>{errors.geometry}</FormHelperText>
      </FormControl>

      <Grid className={classes.formActions} container justify="flex-end">
        <Grid item className={classes.actionButtonContainer}>
          <Button
            variant="contained"
            disabled={isSubmitting}
            onClick={onCancel}
          >
            Cancel
          </Button>
        </Grid>
        <Grid item className={classes.actionButtonContainer}>
          <Button
            color="primary"
            variant="contained"
            disabled={validationErrors || isSubmitting}
            onClick={async () => {
              setIsSubmitting(true);
              await onSubmit();
              setIsSubmitting(false);
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

export default Form;
