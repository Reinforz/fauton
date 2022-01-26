/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { useThemeConfig } from '@docusaurus/theme-common';
import useIsBrowser from '@docusaurus/useIsBrowser';
import clsx from 'clsx';
import React, { memo, useRef, useState } from 'react';
import styles from './styles.module.css'; // Based on react-toggle (https://github.com/aaronshaf/react-toggle/).

const ToggleComponent = memo(
	({ className, switchConfig, checked: defaultChecked, disabled, onChange }) => {
		const { darkIconStyle, lightIconStyle } = switchConfig;
		const [checked, setChecked] = useState(defaultChecked);
		const [focused, setFocused] = useState(false);
		const inputRef = useRef(null);
		return (
			<div
				className={clsx(styles.toggle, className, {
					[styles.toggleChecked]: checked,
					[styles.toggleFocused]: focused,
					[styles.toggleDisabled]: disabled,
				})}
			>
				{/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
				<div
					className={styles.toggleTrack}
					role="button"
					tabIndex={-1}
					onClick={() => inputRef.current?.click()}
				>
					<div className={styles.toggleTrackCheck}>
						<span className={styles.toggleIcon} style={darkIconStyle}>
							<svg
								version="1.1"
								id="Layer_1"
								xmlns="http://www.w3.org/2000/svg"
								xmlnsXlink="http://www.w3.org/1999/xlink"
								x="0px"
								y="0px"
								viewBox="0 0 512 512"
								xmlSpace="preserve"
								style={{
									transform: 'scale(2)',
								}}
							>
								<circle style={{ fill: '#263A7A' }} cx={256} cy={256} r={256} />
								<path
									style={{ fill: '#121149' }}
									d="M274.253,511.345c101.633-7.161,186.878-73.642,221.344-165.036L238.411,89.122l-101.36,62.869
                l-32.754,168.943l28.389,48.843L274.253,511.345z"
								/>
								<path
									style={{ fill: '#FFC61B' }}
									d="M305.778,341.333c-74.619,0-135.111-60.492-135.111-135.111c0-50.079,27.267-93.762,67.744-117.1
                C154.009,97.914,88.207,169.27,88.207,256c0,92.67,75.124,167.793,167.793,167.793c86.73,0,158.086-65.803,166.878-150.204
                C399.539,314.066,355.857,341.333,305.778,341.333z"
								/>
								<path
									style={{ fill: '#EAA22F' }}
									d="M305.778,341.333c-37.017,0-70.546-14.898-94.949-39.012l-72.894,72.894
                c30.318,30.027,72.023,48.578,118.065,48.578c86.73,0,158.086-65.803,166.878-150.204
                C399.539,314.066,355.857,341.333,305.778,341.333z"
								/>
							</svg>
						</span>
					</div>
					<div className={styles.toggleTrackX}>
						<span className={styles.toggleIcon} style={lightIconStyle}>
							<svg
								version="1.1"
								id="Layer_1"
								xmlns="http://www.w3.org/2000/svg"
								xmlnsXlink="http://www.w3.org/1999/xlink"
								x="0px"
								y="0px"
								viewBox="0 0 420 420"
								xmlSpace="preserve"
								style={{
									transform: 'scale(2)',
								}}
							>
								<g>
									<polygon
										style={{ fill: '#F5C525' }}
										points="420,210 375.774,247.857 399.238,301.145 342.926,315.986 340.945,374.184 283.764,363.211 
                  256.724,414.779 210,380 163.276,414.779 136.236,363.211 79.055,374.184 77.073,315.986 20.762,301.144 44.226,247.858 0,210 
                  44.226,172.143 20.762,118.855 77.074,104.014 79.055,45.816 136.236,56.789 163.276,5.221 210,40 256.723,5.221 283.764,56.789 
                  340.945,45.816 342.927,104.014 399.238,118.856 375.774,172.142 	"
									/>
									<circle style={{ fill: '#F8A805' }} cx={210} cy={210} r={140} />
								</g>
							</svg>
						</span>
					</div>
					<div className={styles.toggleTrackThumb} />
				</div>

				<input
					ref={inputRef}
					checked={checked}
					type="checkbox"
					className={styles.toggleScreenReader}
					aria-label="Switch between dark and light mode"
					onChange={(e) => {
						onChange(e);
					}}
					onClick={() => {
						if (!checked) {
							document.querySelector('.main-wrapper').classList.add('dark');
						} else {
							document.querySelector('.main-wrapper').classList.remove('dark');
						}
						setChecked(!checked);
					}}
					onFocus={() => setFocused(true)}
					onBlur={() => setFocused(false)}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							inputRef.current?.click();
						}
					}}
				/>
			</div>
		);
	}
);
export default function Toggle(props) {
	const {
		colorMode: { switchConfig },
	} = useThemeConfig();
	const isBrowser = useIsBrowser();
	return <ToggleComponent switchConfig={switchConfig} disabled={!isBrowser} {...props} />;
}
