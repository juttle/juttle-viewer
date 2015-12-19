import JuttleViz from 'juttle-viz';

const SINK_REGISTRY = {
    barchart: JuttleViz.Barchart,
    text: JuttleViz.Text,
    timechart: JuttleViz.Timechart,
    table: JuttleViz.Table,
    tile: JuttleViz.Tile,
    piechart: JuttleViz.Piechart,
    scatterchart: JuttleViz.Scatterchart,
    less: JuttleViz.Less,
    events: JuttleViz.Events,
    file: JuttleViz.File,
    timechartvizjs: JuttleViz.TimechartVizJs,
};

export default SINK_REGISTRY;
