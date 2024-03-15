import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './networkPlotGre.css';
// import { networkGrahGen } from '../../funs/networkGraphGen';
import { bubbleChat } from '../../funs/bubbleChatGen';

function NetworkPlotGra({
    statx
}) {
    let initKey = false;
    if (statx === 'full') {
        initKey = true;
    }
    const [showHideKey, setShowHideKey] = useState(initKey);
    // const DataChge =  useSelector((state) => state.DataSetReduc);
    const DatasetsArr = useSelector((state) => state.DataSetReduc.datasetsInfo);
    console.log(DatasetsArr);
    useEffect(() => {
        if (typeof (DatasetsArr.data) !== 'undefined') {
            // networkGrahGen(DataChge.chatsData.netData);
            bubbleChat(DatasetsArr.data);
        }
    }, [DatasetsArr.data])
    let nomStyles = {display: 'flex'};
    if (initKey) {
        nomStyles = {
            display: 'flex',
            position: 'relative'
        }
    }
    return (
        <div className="NetworkPlotGraMain">
            <h3 className="NetworkPlotGRaHeader">
                Scalability Visualization 
            </h3>
            <div className="KeySectionHolderWithPosAb" style={initKey ? {height: 'auto'} : {}}>
                <button style={initKey ? {display: 'none'} : {display: 'none'}}  onClick={() => setShowHideKey(true)} type="button" className="GraphKeyToggleButtonNetGraph">
                    <span className="material-symbols-outlined">
                        info
                    </span>
                </button>
                <div className="KeyNetworgraph" style={showHideKey ? nomStyles : {}}>
                    <div className="KeyIconHolderAll" style={{paddingLeft: '9px'}}>
                        <button style={initKey ? {display: 'none'} : {}} onClick={() => setShowHideKey(true)} type="button" className="GraphHideKeyNetGraph">
                            <span className="material-symbols-outlined">
                                close
                            </span>
                        </button>
                    </div>
                    {/* <div className="NRowNetworkGraphKey">
                        <div className="ShapeHolderKeyNetwork">
                            <div className="ShapeKeyNetwork" style={{ backgroundColor: '#ff3636', borderRadius: '3px' }}></div>
                        </div>
                        <div className="KeyDiscrbNetwork">
                            R_square below 0.55
                        </div>
                    </div>
                    <div className="NRowNetworkGraphKey">
                        <div className="ShapeHolderKeyNetwork">
                            <div className="ShapeKeyNetwork" style={{ backgroundColor: '#61DAFB', borderRadius: '3px' }}></div>
                        </div>
                        <div className="KeyDiscrbNetwork">
                            R_square above 0.75
                        </div>
                    </div>
                    <div className="NRowNetworkGraphKey">
                        <div className="ShapeHolderKeyNetwork">
                            <div className="ShapeKeyNetwork" style={{ backgroundColor: 'orange', borderRadius: '3px' }}></div>
                        </div>
                        <div className="KeyDiscrbNetwork">
                            R_square above 0.55, but below 0.75
                        </div>
                    </div> 
                    const radiusCal = (rows) => {
                        if (rows < 10000) {
                            return 20
                        } else if (rows < 20000) {
                            return 30
                        } else if (rows < 50000) {
                            return 45
                        } else if (rows < 70000) {
                            return 55
                        } else if (rows < 85000) {
                            return 65
                        } else if (rows < 90000) {
                            return 70
                        } else if (rows > 90000) {
                            return 75
                        } else {
                            return 35
                        }
                    } 
                    */}
                    <div className="SizeKeySectionNetwork">

                        {/* <div className="rowNetworkGraph">
                            <div className="ShapeHolderKeyNetwork">
                                <div className="ShapeKeyNetwork" style={{ border: '1px solid #3D2B1F', width: '40px', height: '40px' }}></div>
                            </div>
                            <div className="KeyDiscrbNetwork">
                                {
                                    `10,000 rows or less`
                                }
                            </div>
                        </div>
                        <div className="rowNetworkGraph">
                            <div className="ShapeHolderKeyNetwork">
                                <div className="ShapeKeyNetwork" style={{ border: '1px solid #3D2B1F', width: '60px', height: '60px' }}></div>
                            </div>
                            <div className="KeyDiscrbNetwork">
                                {
                                    `50,000 rows or less`
                                }
                            </div>
                        </div>
                        <div className="rowNetworkGraph">
                            <div className="ShapeHolderKeyNetwork">
                                <div className="ShapeKeyNetwork" style={{ border: '1px solid #3D2B1F', width: '80px', height: '80px' }}></div>
                            </div>
                            <div className="KeyDiscrbNetwork">
                                {
                                    `100,000 rows or less`
                                }
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>

            <div className="PlotHolderNetworkPlotGra">
                <div className="tooltipNetwork"></div>
            </div>
        </div>
    );
}

export default NetworkPlotGra;
