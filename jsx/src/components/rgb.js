/************************************************************************
* Copyright 2021-2024 Moss Finder                                       *
*                                                                       *
* This program is free software: you can redistribute it and/or modify  *
* it under the terms of the GNU General Public License as published by  *
* the Free Software Foundation, either version 3 of the License, or     *
* (at your option) any later version.                                   *
*                                                                       *
* This program is distributed in the hope that it will be useful,       *
* but WITHOUT ANY WARRANTY; without even the implied warranty of        *
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the         *
* GNU General Public License for more details.                          *
*                                                                       *
* You should have received a copy of the GNU General Public License     *
* along with this program.  If not, see <http://www.gnu.org/licenses/>. *
************************************************************************/

// Convert a hex string "7600bc" to a list of rgb values [118, 0, 188]
function stringToRGB(hexString) {
  let hex = parseInt(hexString, 16);
  let convertedHex = [];
  let finalHex = [];
  for (let i = 0; i < 6; i++) {
    convertedHex.unshift(hex % 16);
    hex = (hex - (hex % 16)) / 16;
  }
  for (let i = 0; i < 6; i += 2) {
    finalHex.push(convertedHex[i] * 16 + convertedHex[i+1]);
  }
  return finalHex;
}

// Convert a list of rgb values [118, 0, 188] into a hex string "7600bc"
function RGBToString(RGB) {
  let convertedString = [];
  let finalString = "";
  for (let i = 0; i < 3; i++) {
    convertedString.push(Math.floor(((RGB[i] - RGB[i] % 16) / 16)).toString(16), Math.floor((RGB[i] % 16)).toString(16));
  }
  for (let i = 0; i < 6; i++) {
      finalString += convertedString[i];
  }
  return finalString;
}

// Multiply a list of rgb values by a specific number
function multiplyRGB(RGB, multiplier) {
  let newRGB = [];
  for (let i = 0; i < 3; i++) {
    newRGB.push(RGB[i] * multiplier);
  }
  return newRGB;
}

// Update the custom theme settings to a specific color pallete
export default function updateCustomTheme(attemptHex, states, dry=false) {
  attemptHex = attemptHex.toLowerCase();
  let darkColorFix = attemptHex;
  for (let i = 0; i < 5; i++) {
    if (darkColorFix[0] !== "0") break;
    darkColorFix = darkColorFix.slice(1);
  }

  if (attemptHex.length !== 6 || parseInt(attemptHex, 16).toString(16) !== darkColorFix) return false;
  if (dry) return true;

  setTimeout(()=>{states.setThemeHex(attemptHex)}, 50);
  localStorage.setItem("themeHex", attemptHex);

  let rgb = stringToRGB(attemptHex);

  let colorScheme = 0;
  for (let i = 0; i < 3; i++) colorScheme += rgb[i];

  let primaryColor = "#" + attemptHex;
  let secondaryColor = "#" + RGBToString(multiplyRGB(rgb, 0.75));
  if (colorScheme > 382.5) {
    document.body.style.setProperty('--foreground-level1', "#000000");
    document.body.style.setProperty('--foreground-level2', "#222222");
    document.body.style.setProperty('--accent', "#b300ff");
  }
  else {
    document.body.style.setProperty('--foreground-level1', "#ffffff");
    document.body.style.setProperty('--foreground-level2', "#e0e0e0");
    document.body.style.setProperty('--accent', "#c847ff");
  }

  document.body.style.setProperty('--outgradient', primaryColor);
  document.body.style.setProperty('--ingradient', primaryColor);
  document.body.style.setProperty('--outgradientsmooth', "linear-gradient(" + primaryColor + ", " + secondaryColor + ")");
  document.body.style.setProperty('--ingradientsmooth', "linear-gradient(" + secondaryColor + ", " + primaryColor + ")");
  document.body.style.setProperty('--background-level1', "#" + RGBToString(multiplyRGB(rgb, 0.82189542485)));
  document.body.style.setProperty('--background-level2', "#" + RGBToString(multiplyRGB(rgb, 0.85751633988)));
  document.body.style.setProperty('--background-level3', "#" + RGBToString(multiplyRGB(rgb, 0.89313725491)));
  document.body.style.setProperty('--background-level4', "#" + RGBToString(multiplyRGB(rgb, 0.92875816994)));
  document.body.style.setProperty('--background-level5', "#" + RGBToString(multiplyRGB(rgb, 0.96437908497)));
  document.body.style.setProperty('--background-level6', primaryColor);
  document.body.style.setProperty('--grey', "#888888");
  return true;
}