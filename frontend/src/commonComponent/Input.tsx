import React, { useState } from 'react';
import { TextField, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export const Input = ({ ...props }) => {
  const { name, variant, label, value, error = null, onChange, ...other } = props
  return (
    <TextField
      variant="outlined"
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      size="medium"
      {...(error && { error: true, helperText: error })}
      {...other}
    />
  )
}

export const Password = ({ ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { name, label, value, error = null, onChange, ...other } = props

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };


  return (
    <TextField
      variant="outlined"
      label={label}
      type={showPassword ? 'text' : 'password'}
      name={name}
      value={value}
      onChange={onChange}
      size="medium"
      InputProps={{
        endAdornment: (
          <IconButton onClick={toggleShowPassword}>
            {showPassword ? <Visibility /> : <VisibilityOff />}
          </IconButton>
        ),
      }}
      {...(error && { error: true, helperText: error })}
      {...other}
    />
  )
}



export const Inputmuliline = ({ ...props }) => {
  const { name, label, value, error = null, onChange, ...other } = props
  return (
    <TextField
      variant="outlined"
      label={label}
      name={name}
      value={value}
      size="medium"
      multiline
      onChange={onChange}
      {...(error && { error: true, helperText: error })}
      {...other}
    />
  )
}