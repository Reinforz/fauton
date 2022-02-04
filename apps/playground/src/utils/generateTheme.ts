import { grey, red } from '@mui/material/colors';
import { createTheme, darken, lighten, ThemeOptions } from '@mui/material/styles';

export function generateTheme() {
	const primaryColor = 'rgba(26, 32, 44)';
	const primaryColorDarker = darken(primaryColor, 0.5);
	const primaryColorLighter = lighten(primaryColor, 0.05);

	const secondaryColor = `rgba(45, 55, 72)`;

	const themeOptions: ThemeOptions = {
    spacing: 10,
		palette: {
			error: {
				main: red[500],
			},
			text: {
				primary: grey[200],
				secondary: grey[300],
			},
			primary: {
				main: primaryColor,
			},
		},
		typography: {
			fontFamily: 'Roboto',
			fontSize: 14,
			body1: {
				fontWeight: 500,
				fontSize: '1em',
			},
			body2: {
				fontWeight: 500,
				fontSize: '0.85em',
			},
			subtitle1: {
				fontSize: '1em',
				fontWeight: 400,
				color: grey[700],
			},
			subtitle2: {
				fontSize: '0.85em',
				fontWeight: 300,
				color: grey[700],
			},
			h3: {
				fontWeight: 700,
        fontSize: '2em',
			},
			h4: {
				fontWeight: 700,
        fontSize: '1.75em',
			},
			h5: {
        fontSize: '1.5em',
				fontWeight: 700,
			},
			h6: {
        fontSize: '1.25em',
				fontWeight: 600,
			},
			caption: {
				fontSize: '1em',
				fontWeight: 700,
			},
		},
		components: {
			MuiSelect: {
				styleOverrides: {
					select: {
						padding: 10,
						'&.Mui-disabled': {
							color: grey[600],
						},
					},
				},
			},
      MuiTypography: {
        styleOverrides: {
          h5: {
            margin: 10
          }
        }
      },
			MuiPaper: {
				styleOverrides: {
					root: {
						backgroundColor: primaryColor,
					},
				},
			},
			MuiMenuItem: {
				styleOverrides: {
					root: {
						'&:hover': {
							backgroundColor: primaryColorLighter,
						},
						'&.Mui-selected': {
							backgroundColor: primaryColorDarker,
						},
					},
				},
			},
			MuiOutlinedInput: {
				styleOverrides: {
					root: {
						border: `2px solid ${secondaryColor}`,
						outline: 'none',
					},
					input: {
						padding: 10,
					},
				},
			},
			MuiButton: {
				styleOverrides: {
					root: {
						backgroundColor: secondaryColor,
						'&.Mui-disabled': {
							color: grey[600],
						},
					},
				},
			},
		},
	};

	return createTheme(themeOptions);
}
