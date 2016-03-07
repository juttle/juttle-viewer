import React from 'react';
import _ from 'underscore';

import LogLine from './log-line';

const WINDOW_SIZE = 10;

class LogExplorer extends React.Component {
    constructor() {
        super();

        this.state = {
            allLines : [],
            searchTerm : null,
            cursorPosition : 0,
            windowStart : 0
        };
    }
    _onKeyUpSearchBox(e) {
        if (e.keyCode !== 13) { // return if not enter key
            return;
        }

        e.preventDefault();
        let searchTerm = this.refs.searchTermBox.value;

        let matches = [];

        for(let i = 0; i < this.props.logLines.length; i++) {
            let lineLowerCase = this.props.logLines[i].text.toLowerCase();

            if (lineLowerCase.indexOf(searchTerm.toLowerCase()) !== -1) {
                matches.push(i);
            }
        }
        this.setState({
            matches : matches,
            searchTerm : searchTerm
        });

        this.refs.currentLogOutput.focus();

        if (this._searchRoleReversal) {
            this._moveToPrevMatch(matches);
        }
        else {
            this._moveToNextMatch(matches);
        }
    }
    _onKeyDownLogWindow(e) {
        let keyCode = e.keyCode;
        let pos = this.state.cursorPosition;
        let newWindowStart;
        let handled = false;
        switch(keyCode) {
            case 78: // n
                handled = true;
                if (this._searchRoleReversal) {
                    this._moveToPrevMatch(this.state.matches);
                }
                else {
                    this._moveToNextMatch(this.state.matches);
                }
                break;
            case 80: // p
                handled = true;
                if (this._searchRoleReversal) {
                    this._moveToNextMatch(this.state.matches);
                }
                else {
                    this._moveToPrevMatch(this.state.matches);
                }
                break;
            case 191: // /
                handled = true;
                this._searchRoleReversal = !!e.shiftKey;
                this.refs.searchTermBox.getDOMNode().focus();
                this.refs.searchTermBox.getDOMNode().select();
                break;
            case 71: // g
                handled = true;
                if (e.shiftKey) {
                    this._goToEnd();
                }
                else {
                    this._goToStart();
                }
                break;
            case 32: // space
                handled = true;
                this._pageDown();
                break;
            case 66: // b
                handled = true;
                this._pageUp();
                break;
            case 75: // k
            case 38: // up arrow
                handled = true;
                if (pos !== 0) {
                    if (this.state.cursorPosition === this.state.windowStart) {
                        newWindowStart = this.state.windowStart - 1;
                        this.setState({
                            windowStart : newWindowStart
                        });
                    }

                    this.setState({
                        cursorPosition : pos-1
                    });
                }
                break;
            case 74: // j
            case 40: // down arrow
                handled = true;
                if (this.state.cursorPosition !== this.props.logLines.length-1) {
                    if (this.state.cursorPosition === this.state.windowStart + WINDOW_SIZE - 1) {
                        newWindowStart = this.state.windowStart + 1;
                        this.setState({
                            windowStart : newWindowStart
                        });
                    }

                    this.setState({
                        cursorPosition : pos+1
                    });
                }
                break;
        }

        if (handled) {
            e.preventDefault();
        }
    }
    _moveToNextMatch(matches) {
        let pos = this.state.cursorPosition;
        let match = _.find(matches, function(match) {
            return match > pos;
        });

        if (match !== undefined) {
            this.setState({
                cursorPosition : match
            });

            if (match >= this.state.windowStart + WINDOW_SIZE) {
                this.setState({
                    windowStart : match - WINDOW_SIZE + 1
                });
            }
        }
    }
    _moveToPrevMatch(matches) {
        let pos = this.state.cursorPosition;
        let match = _.find(matches.slice().reverse(), function(match) {
            return match < pos;
        });

        if (match !== undefined) {
            this.setState({
                cursorPosition : match
            });

            if (match < this.state.windowStart) {
                this.setState({
                    windowStart : match
                });
            }
        }
    }
    _goToStart() {
        this.setState({
            cursorPosition : 0,
            windowStart: 0
        });
    }
    _goToEnd() {
        this.setState({
            cursorPosition : this.props.logLines.length-1,
            windowStart : this.props.logLines.length - WINDOW_SIZE
        });
    }
    _pageUp() {
        if(this.state.windowStart - WINDOW_SIZE < 0) {
            this._goToStart();
        }
        else {
            this.setState({
                cursorPosition : this.state.cursorPosition - WINDOW_SIZE,
                windowStart : this.state.windowStart - WINDOW_SIZE
            });
        }
    }
    _pageDown() {
        if(this.state.windowStart + 2*WINDOW_SIZE > this.props.logLines.length-1) {
            this._goToEnd();
        }
        else {
            this.setState({
                cursorPosition : this.state.cursorPosition + WINDOW_SIZE,
                windowStart : this.state.windowStart + WINDOW_SIZE
            });
        }
    }
    _onCursorPositionUpdate(lineNumber, charIndex) {
        this.setState({
            cursorPosition : [lineNumber, charIndex]
        });
    }
    render() {
        let linesToShow = this.props.logLines.slice(this.state.windowStart, this.state.windowStart + WINDOW_SIZE)
            .map((line) => {
                return <LogLine key={line.index} index={line.index} cursorLine={line.index === this.state.cursorPosition} searchTerm={this.state.searchTerm} lineText={line.text}/>;
            });
            
        if (linesToShow.length === 0) {
            return (<div className="log-explorer"> No logs have been received. Press re-run to enable debug mode. </div>)
        }

        return (
            <div className="log-explorer">
                <div tabIndex={1} className="loglines" ref="currentLogOutput" onKeyDown={this._onKeyDownLogWindow.bind(this)}>
                    {linesToShow}
                </div>
                <input 
                    className="search-box" 
                    ref="searchTermBox"
                    placeholder="search term" 
                    onKeyUp={this._onKeyUpSearchBox.bind(this)} 
                    type="text" 
                    />
                <div className="line-counts">{this.state.cursorPosition + 1 } / {this.props.logLines.length}</div>
            </div>
        );
    }
}

export default LogExplorer;
