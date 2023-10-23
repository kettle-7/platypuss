 /************************************************************************
 * Copyright 2020-2023 Ben Keppel                                        *
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

var converty = new showdown.Converter({
    simplifiedAutoLink: true,
    literalMidWordUnderscores: true,
    strikethrough: true,
    tables: true,
    tasklists: true,
    disableForced4SpacesIndentedSublists: true,
    simpleLineBreaks: false,
    requireSpaceBeforeHeadingText: true,
    openLinksInNewWindow: false,
    emoji: true,
    underline: true
});

fetch(`${window.location.toString().replace(/.html/g, "") + ".md"}`).then(res => {
    res.text().then(txt => {
        let lines = txt.split('\n');
        let out = '';
        if (window.location.toString().includes("chausdhsa89h98q3hai")) {
            document.getElementById("ptitle").innerHTML = "chausdhsa89h98q3hai";
            document.getElementById("htitle").innerHTML = "chausdhsa89h98q3hai";
        }
        else
            document.getElementById("ptitle").innerHTML = lines[0];
        for (let c = 1; c < lines.length; c++) { out += lines[c] + '\n' }
        document.getElementById("page").innerHTML = converty.makeHtml(out) + "<br><br>";
    });
});
