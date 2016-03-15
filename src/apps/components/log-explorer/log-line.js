import React from 'react';
import classnames from 'classnames';

class LogLine extends React.Component {
    _findMatches(text, searchTerm) {
        if (!searchTerm) {
            return [];
        }

        let matches = [];
        let startIndex = 0;
        let lineTextLowerCase = text.toLowerCase();
        let searchTermLowerCase = searchTerm.toLowerCase();
        let searchTermLength = searchTerm.length;
        let match;
        do {
            match = lineTextLowerCase.indexOf(searchTermLowerCase);
            if (match !== -1) {
                matches.push(startIndex+match);
            }

            startIndex += match+searchTermLength;

            lineTextLowerCase = lineTextLowerCase.slice(match+searchTermLength);
        } while(match !== -1);
        
        return matches;
    }

    _buildLineSpans(matches, searchTermLength, cursorLine) {
        let startIndex = 0;

        let nonMatchedClass = classnames({
            'cursor-line': cursorLine
        });

        let spans = [];
        
        for(let i = 0; i < matches.length; i++) {
            let matchStart = matches[i];
            spans.push(<span key={i + 'a'} className={nonMatchedClass}>{this.props.lineText.substr(startIndex,matchStart - startIndex)}</span>);
            spans.push(<span key={i + 'b'} className="match">{this.props.lineText.substr(matchStart,searchTermLength)}</span>);
            startIndex = matchStart + searchTermLength;
        }

        spans.push(<span key={'c'} className={nonMatchedClass}>{this.props.lineText.substr(startIndex)}</span>);

        return spans;
    }

    render() {
        let searchTermLength = this.props.searchTerm ? this.props.searchTerm.length : 0;

        let matches = this._findMatches(this.props.lineText, this.props.searchTerm);
        let spans = this._buildLineSpans(matches,searchTermLength, this.props.cursorLine);
        return (
            <div className="log-line">{spans}</div>
        );
    }
}

export default LogLine;
