import React from 'react';
import _ from 'underscore';

import LogLine from './log-line';
import KEY_CODES from './key-codes';

const WINDOW_SIZE = 10;

class LogExplorer extends React.Component {
    constructor() {
        super();

        this.state = {
            allLines : [],
            searchTerm : null,
            cursorPosition : 1,
            windowStart : 1
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
                matches.push(this.props.logLines[i].index);
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
            //result of enter key on search should stay on first result
            let compare = (match) => { return match >= this.state.cursorPosition; };
            this._moveToNextMatch(matches, compare);
        }
    }
    _onKeyDownLogWindow(e) {
        let keyCode = e.keyCode;
        let pos = this.state.cursorPosition;
        let newWindowStart;
        let handled = false;
        switch(keyCode) {
            case KEY_CODES.n:
                handled = true;
                if (this._searchRoleReversal) {
                    this._moveToPrevMatch(this.state.matches);
                }
                else {
                    this._moveToNextMatch(this.state.matches);
                }
                break;
            case KEY_CODES.p:
                handled = true;
                if (this._searchRoleReversal) {
                    this._moveToNextMatch(this.state.matches);
                }
                else {
                    this._moveToPrevMatch(this.state.matches);
                }
                break;
            case KEY_CODES.forwardSlash:
                handled = true;
                this._searchRoleReversal = !!e.shiftKey;
                this.refs.searchTermBox.focus();
                this.refs.searchTermBox.select();
                break;
            case KEY_CODES.g:
                handled = true;
                if (e.shiftKey) {
                    this._goToEnd();
                }
                else {
                    this._goToStart();
                }
                break;
            case KEY_CODES.space:
                handled = true;
                this._pageDown();
                break;
            case KEY_CODES.b:
                handled = true;
                this._pageUp();
                break;
            case KEY_CODES.k:
            case KEY_CODES.upArrow:
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
            case KEY_CODES.j:
            case KEY_CODES.downArrow:
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
    _moveToNextMatch(matches, compare) {
        let compareFunction = (match) => { return match > this.state.cursorPosition; };
        if (compare) {
            compareFunction = compare;
        }
        
        let match = _.find(matches, compareFunction);
        
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
            cursorPosition : 1,
            windowStart: 1
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
        if(this.state.windowStart + 2*WINDOW_SIZE > this.props.logLines.length) {
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
        let logLines = this.props.logLines || [];
        let linesToShow = logLines.slice(this.state.windowStart, this.state.windowStart + WINDOW_SIZE)
            .map((line) => {
                return <LogLine key={line.index} index={line.index} cursorLine={line.index === this.state.cursorPosition} searchTerm={this.state.searchTerm} lineText={line.text}/>;
            });
            
        if (linesToShow.length === 0) {
            return (<div className="log-explorer"> No logs have been received. Press re-run to enable debug mode. </div>)
        }

        return (
            <div className="log-explorer">
                <span className="help-block">Paginate through logs using linux less commands</span>
                <div tabIndex={1} className="loglines" ref="currentLogOutput" onKeyDown={this._onKeyDownLogWindow.bind(this)}>
                    {linesToShow}
                </div>
                <div className="form-group">
                    <input 
                        className="form-control" 
                        ref="searchTermBox"
                        placeholder="search term" 
                        onKeyUp={this._onKeyUpSearchBox.bind(this)} 
                        type="text" 
                        />
                    <span className="help-block">{this.state.cursorPosition + 1 } / {logLines.length}</span>
                </div>
            </div>
        );
    }
}

export default LogExplorer;
