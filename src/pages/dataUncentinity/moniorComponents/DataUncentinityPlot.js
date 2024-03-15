import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { stickGeneRator } from '../../../funs/candleStickGene';
import { Slider } from '@mui/material';
import './dataUncentinityPlot.css';

function DataUncentinityPlot({
    statx
}) {
    const [dispval, setDispval] = useState(50);
    let initKey = false;
    if (statx === 'full') {
        initKey = true;
    }
    const [showHideKey, setShowHideKey] = useState(initKey);
    const [dispText, setDispText] = useState('STCANet');
    const DataChge =  useSelector((state) => state.DataSetReduc);
    let Tlen = 0;
    if (typeof (DataChge.chatsData.ensemb) !== 'undefined') {
        Tlen = Object.keys(DataChge.chatsData.ensemb).length;
    }
    
    useEffect(() =>{
        if (typeof (DataChge.chatsData.ensemb) !== 'undefined') {
            stickGeneRator('PlotSurroundingsDataUncentinityMain', DataChge.chatsData.ensemb, dispval);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispval, DataChge.chatsData, Tlen, DataChge.chatsData.ensemb]);
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
    return (
        <div className="DataUncentinityPlotMain">
            <div className="PlotHeaderDataUncentinity">
                <h3 className="HeadNameDataUncentinity">
                    Uncertainty view
                </h3>
                <div className="ButtonsNSliderALL">
                    <div className="ControlsCandleChart">
                        <Link to="/">
                            <button style={{marginRight: '10px', backgroundColor: 'transparent', border: '1px solid #61DAFB'}} className="CandleZoomControlsButtons" type="button">
                                <span className="material-symbols-rounded" style={{ color: '#000' }}>
                                    zoom_in_map
                                </span>
                            </button>
                        </Link>
                        <Link to="/data_unce">
                            <button className="CandleZoomControlsButtons" type="button">
                                <span className="material-symbols-rounded">
                                    zoom_out_map
                                </span>
                            </button>
                        </Link>
                    </div>
                </div>
                <div className="SliderLocTopDAta">
                    <div className="SliderHolderAll" style={{right: '-50px'}}>
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
            </div>
            <div className="PlotSurroundingsDataUncentinityMain">
                
            </div>
            <div className="OpenKeyButtonHolder" style={showHideKey ? {display: 'none'} : {}}>
                <button onClick={() => setShowHideKey(true)} type="button" className="GraphKeyToggleButton">
                    <span className="material-symbols-outlined">
                        info
                    </span>
                </button>
            </div>
            <div className="KeyHolderForShowAndHide" style={!showHideKey ? {display: 'none'} : {top: '-10px'}}>
                <div className="KeyNControlsINFoCandleChart">
                    <div className="KeyNControlsCandleChart">
                        <div className="KeySectCandleChart">
                            {/* <div className="KeyIconHolderAll" style={{marginBottom: '7px'}}>
                                <span className="material-symbols-outlined">
                                    info
                                </span>
                            </div> */}
                            <div className="RowKeyTableCandleChart">
                                <div className="ShapeHolderRowCandleChart">
                                    <div className="ShapeCandleChart" style={{width: '3px', backgroundColor: '#7F00FF'}}></div>
                                </div>
                                <div className="DiscRowCandleChart">
                                    Attention channel prediction range
                                </div>
                            </div>
                            <div className="RowKeyTableCandleChart">
                                <div className="ShapeHolderRowCandleChart">
                                    <div className="ShapeCandleChart" style={{width: '3px', backgroundColor: '#90EE90'}}></div>
                                </div>
                                <div className="DiscRowCandleChart">
                                    Spatial attention module prediction range
                                </div>
                            </div>
                            <div className="RowKeyTableCandleChart">
                                <div className="ShapeHolderRowCandleChart">
                                    <div className="ShapeCandleChart" style={{borderRadius: '3px', background: "linear-gradient(#008000, #90EE90)"}}></div>
                                </div>
                                <div className="DiscRowCandleChart">
                                    Spatial attention module average prediction range
                                </div>
                            </div>
                            <div className="RowKeyTableCandleChart">
                                <div className="ShapeHolderRowCandleChart">
                                    <div className="ShapeCandleChart" style={{borderRadius: '3px', background: "linear-gradient(#E6E6FA, #7F00FF)"}}></div>
                                </div>
                                <div className="DiscRowCandleChart">
                                    Attention channel module average prediction range
                                </div>
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
    );
}

export default DataUncentinityPlot;