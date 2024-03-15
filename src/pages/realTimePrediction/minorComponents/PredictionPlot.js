import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Slider } from '@mui/material';
import './predictionPlot.css';
import { generatePredictionGraph } from '../../../funs/predictionPlotGene';
import SelectInput from '../../Micros/SelectInput';


const datanodes = [
    [
      {name: 'STCANet', value: 60}
    ],
    [
        {name: 'Spatial Module'}
    ],
    [
      {name: 'S_CNN', value: 60}
    ],
    [
      {name: 's12'}
    ],
  
];

function PredictionPlot({
    statx
}) {
    let initKey = false;
    if (statx === 'full') {
        initKey = true;
    }
    const mode2 = [
        {name: 'S_CNN', value: 60},{name: 'RELU', value: 60},{name: 'SCAM', value: 60},{name: 'GRU', value: 60}
    ];
    const mode1 = [
        {name: 'Spatial Module'}, {name: 'AT.C Module'},
    ];
    const [mode2State, setMode2State] = useState(1);
    const [mode1State, setMode1State] = useState(1);
    // const [anyModeChange, setAnyModeChange] = useState(0);
    const [nodesInfo, setNodeInfo] = useState(datanodes);
    const [dispval, setDispval] = useState(50);
    const [showHideKey, setShowHideKey] = useState(initKey);
    const [dispText, setDispText] = useState('STCANet');
    const DataChge =  useSelector((state) => state.DataSetReduc);
    useEffect(() =>{
        if (typeof (DataChge.chatsData.predData) !== 'undefined') {
            generatePredictionGraph(DataChge.chatsData.predData, DataChge.chatsData.len, dispval, nodesInfo, true);
        } else {
            generatePredictionGraph([[19, 300]], 7690, dispval, nodesInfo, false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispval, DataChge.chatsData.predData, DataChge.chatsData.len, nodesInfo[1].length, nodesInfo[2].length])

    const marks = [
        {
          value: 0,
          label: '',
        },
        {
          value: 50,
          label: '',
        },
        {
          value: 100,
          label: '',
        },
      ];

    
    const ChangeGraphState = (em, val) =>{
        setDispval(val);
        if (val === 100) {
            setDispText('attention Chanel module');
            return 0;
        } else if (val === 0) {
            setDispText('spatial module');
            return 0;
        }
        setDispText('STCANet');
    }

    const addMod2State = (numadd) => {
        if (numadd<=4) {
            const Nmode2 = [];
            for (let index = 0; index < numadd; index++) {
                Nmode2.push(mode2[index]);
            }
            const nNodes = nodesInfo;
            nNodes[2] = Nmode2;
            setNodeInfo(nNodes);
            setMode2State(mode2State+1);
        }
    }

    const removeMod2State = (numrmv) => {
        if (numrmv> 0) {
            const Nmode2 = [];
            for (let index = 0; index < numrmv; index++) {
                Nmode2.push(mode2[index]);
            }
            const nNodes = nodesInfo;
            nNodes[2] = Nmode2;
            setNodeInfo(nNodes);
            setMode2State(numrmv);
        }
    }

    const addMod1State = (numadd) =>{
        if (numadd<=2) {
            const Nmode2 = [];
            for (let index = 0; index < numadd; index++) {
                Nmode2.push(mode1[index]);
            }
            const nNodes = nodesInfo;
            nNodes[1] = Nmode2;
            setNodeInfo(nNodes);
            setMode1State(numadd);
        }
    }

    const removeMod1State = (numadd) =>{
        if (numadd> 0) {
            const Nmode2 = [];
            for (let index = 0; index < numadd; index++) {
                Nmode2.push(mode1[index]);
            }
            const nNodes = nodesInfo;
            nNodes[1] = Nmode2;
            setNodeInfo(nNodes);
            setMode1State(numadd);
        }
    }

    const changeFunSelect = (name, val) =>{

    }

    let AOptions = [
        {
            OpName: 'ReLu',
            value: 'relu',
            is_selected: true,
        },
        {
            OpName: 'Tanh',
            value: 'tanh',
            is_selected: false,
        },
        {
            OpName: 'Sigmoid',
            value: 'sig',
            is_selected: false,
        }
    ];

    let LOptions = [

        {
            OpName: '0.3',
            value: '0.3',
            is_selected: false,
        },
        {
            OpName: '0.1',
            value: '0.1',
            is_selected: false,
        },
        {
            OpName: '0.03',
            value: '0.03',
            is_selected: true,
        },
        {
            OpName: '0.01',
            value: '0.01',
            is_selected: false,
        },
        {
            OpName: '0.003',
            value: '0.003',
            is_selected: false,
        },
        {
            OpName: '0.001',
            value: '0.001',
            is_selected: false,
        },
        {
            OpName: '0.0001',
            value: '0.0001',
            is_selected: false,
        }
    ];
    
    return (
        <div className="PredictionPlotMain">
            <div className="HeadingPredictionPlot">
                <div className="topSectionSelecTInputHolder">
                    <div className="inputHolderSelectPredict">
                        <SelectInput
                            LabelName="Activation"
                            ChangeFun={changeFunSelect} 
                            InputStyleClass="shortSelectPredictGraph" 
                            defaultVal="ReLu"
                            InputName="activation"
                            is_Required={true}
                            options={AOptions}
                        />
                    </div>
                    <div className="inputHolderSelectPredict">
                        <SelectInput
                            LabelName="Learning Rate"
                            ChangeFun={changeFunSelect} 
                            InputStyleClass="shortSelectPredictGraph" 
                            defaultVal="0.03"
                            InputName="activation"
                            is_Required={true}
                            options={LOptions}
                        />
                    </div>
                </div>
                <h3 className="HeadNamePredictionPlot">
                    Prediction view
                </h3>
                <div className="ButtonsNSliderALL">
                    <div className="ControlsPredictions">
                        <Link to="/">
                            <button style={{marginRight: '10px', backgroundColor: 'transparent', border: '1px solid #61DAFB'}} className="ZoomControlsButtons" type="button">
                                <span className="material-symbols-rounded" style={{ color: '#000' }}>
                                    zoom_in_map
                                </span>
                            </button>
                        </Link>
                        <Link to="/predict">
                            <button className="ZoomControlsButtons" type="button">
                                <span className="material-symbols-rounded">
                                    zoom_out_map
                                </span>
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="PlotSurroundsPredictionPlot">
                <div className="HeatMapPlotSection">
                    <div style={{width: '100%', height: '100%'}}>
                        {/* don't delete */}
                    </div>
                </div>
                <div className="ButtonsAddMinusHolder">
                    <div className="columnButtonsGroup column0">
                        
                    </div>
                    <div className="columnButtonsGroup column1">
                        <div className="buttonHolder">
                            <button className="addMinusButtonGraph" onClick={() => addMod1State(mode1State+1)}>
                                <span className="material-symbols-rounded">
                                    add
                                </span>
                            </button>
                            <button className="addMinusButtonGraph" onClick={() => removeMod1State(mode1State-1)}>
                                <span className="material-symbols-rounded">
                                    remove
                                </span>
                            </button>
                        </div>
                        <div className="textInfoGraphsSankey">{`${mode1State} Layers`}</div>
                    </div>
                    <div className="columnButtonsGroup column3" >
                       <div className="buttonHolder">
                            <button className="addMinusButtonGraph" onClick={() => addMod2State(mode2State+1)}>
                                <span className="material-symbols-rounded">
                                    add
                                </span>
                            </button>
                            <button className="addMinusButtonGraph" onClick={() => removeMod2State(mode2State - 1)}>
                                <span className="material-symbols-rounded">
                                    remove
                                </span>
                            </button>
                        </div>
                        <div className="textInfoGraphsSankey">{`${mode2State} Layers`}</div>
                    </div>
                    <div className="columnButtonsGroup column0">
                        
                    </div>
                </div>
                <div className="allGraphsWithPlotsScaney">
                    <div className="sankey-diagram">

                    </div>
                    <div className="ScatteredPlotHolder">
                        <div className="SliderNewLocHolder">
                            <div className="SliderHolderAll">
                                <div className="ValueSliderDisp">
                                    {
                                        dispText
                                    }
                                </div>
                                <div className="SliderOnlyHolder">
                                    <Slider
                                        aria-label="Restricted values"
                                        defaultValue={50}
                                        step={null}
                                        valueLabelDisplay="off"
                                        marks={marks}
                                        onChange={ChangeGraphState}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="ScattedPlotSection">
                            {/* don't delete */}
                        </div>
                    </div>
                </div>
                {/* Keyes */}
                <div className="GraphInfoPredictChart" style={{display: 'none'}}>
                        This graph shows how two different modules are affected with increase of data size and number of iterations
                </div>
                <div className="OpenKeyButtonHolder">
                    <div style={{width: 'calc(55% - 60px)'}}>
                        <div className="KeySankeyGraphHolder">
                            <div className="keyRowSankeyGraph">
                                <div className="colorHolderSankey" style={{backgroundColor: '#FF5733'}} />
                                <div className="keyvalSankey">Hs</div>
                            </div>
                            <div className="keyRowSankeyGraph">
                                <div className="colorHolderSankey" style={{backgroundColor: '#33FF57'}} />
                                <div className="keyvalSankey">Hmax</div>
                            </div>
                            <div className="keyRowSankeyGraph">
                                <div className="colorHolderSankey" style={{backgroundColor: '#3366FF'}} />
                                <div className="keyvalSankey">Tz</div>
                            </div>
                            <div className="keyRowSankeyGraph">
                                <div className="colorHolderSankey" style={{backgroundColor: '#FF33E9'}} />
                                <div className="keyvalSankey">Tp</div>
                            </div>
                            <div className="keyRowSankeyGraph">
                                <div className="colorHolderSankey" style={{backgroundColor: '#006600'}} />
                                <div className="keyvalSankey">Peak Direction</div>
                            </div>
                            <div className="keyRowSankeyGraph">
                                <div className="colorHolderSankey" style={{backgroundColor: '#33FFFF'}} />
                                <div className="keyvalSankey">SST</div>
                            </div>
                        </div>
                        <div className="KeySankeyGraphHolder">
                            <div className="keyRowSankeyGraph">
                                <div style={{fontSize: '15px', marginRight: '5px', fontWeight: '600'}}>AT.C Module:</div>
                                <div className="keyvalSankey">Attention Channel Module</div>
                            </div>
                            <div className="keyRowSankeyGraph">
                                <div style={{fontSize: '15px', marginRight: '5px', fontWeight: '600'}}>S_CNN:</div>
                                <div className="keyvalSankey">SEQ_CNN</div>
                            </div>
                        </div>
                    </div>
                    <div style={showHideKey ? {display: 'none'} : {}} className="predictGraphOpenKeyHolder">
                        <button onClick={() => setShowHideKey(true)} type="button" className="GraphKeyToggleButton">
                            <span className="material-symbols-outlined">
                                info
                            </span>
                        </button>
                    </div>
                </div>
                <div className="KeyHolderForShowAndHide" style={!showHideKey ? {display: 'none'} : { width: 'calc(45% + 50px)', right: '0', marginLeft: 'auto', top: '-40px'}}>
                    <div className="KeyNInfoNControls">
                        <div className="KeyPrediction">
                            <div className="KeyIconHolderAll" style={{display: 'none'}}>
                                <span className="material-symbols-outlined">
                                    info
                                </span>
                            </div>
                            <div className="keyRowInfPrediction">
                                <div className="ShapeHolderKeyPrediction">
                                    <div className="NShapeKeyPrediction"></div>
                                </div>
                                <div className="KeyShapeDiscrbePrediction">
                                    Predicted Values
                                </div>
                            </div>
                            <div className="keyRowInfPrediction">
                                <div className="ShapeHolderKeyPrediction">
                                    <div className="ShapeKeyPrediction" style={{backgroundColor: '#FF3535'}}></div>
                                </div>
                                <div className="KeyShapeDiscrbePrediction">
                                    Areas with many predicted values
                                </div>
                            </div>
                            <div className="keyRowInfPrediction">
                                <div className="ShapeHolderKeyPrediction">
                                    <div className="ShapeKeyPrediction" style={{backgroundColor: '#C89063'}}></div>
                                </div>
                                <div className="KeyShapeDiscrbePrediction">
                                    Areas with moderate predicted values
                                </div>
                            </div>
                            <div className="keyRowInfPrediction">
                                <div className="ShapeHolderKeyPrediction">
                                    <div className="ShapeKeyPrediction" style={{backgroundColor: '#010080'}}></div>
                                </div>
                                <div className="KeyShapeDiscrbePrediction">
                                    Areas with very few or no predicted values
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="CloseButtonHolderNControls">
                        <button style={initKey ? {display: 'none'} : {}} onClick={() => setShowHideKey(false)} type="button" className="GraphHideKey">
                            <span className="material-symbols-outlined">
                                close
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PredictionPlot;
