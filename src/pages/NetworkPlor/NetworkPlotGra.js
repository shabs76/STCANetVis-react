import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import './networkPlotGre.css';
// import { networkGrahGen } from '../../funs/networkGraphGen';
import { bubbleChat } from '../../funs/bubbleChatGen';
import { initialData } from '../../funs/specials';

function NetworkPlotGra({
    statx
}) {
    const ingInpt = useRef(null);

    let initKey = false;
    if (statx === 'full') {
        initKey = true;
    }

    const [showHideKey, setShowHideKey] = useState(initKey);
    // const DataChge =  useSelector((state) => state.DataSetReduc);
    const DatasetsArr = useSelector((state) => state.DataSetReduc.datasetsInfo);
    let initDT = initialData
    if (localStorage.getItem("dataInit")) {
        initDT = JSON.parse(localStorage.getItem("dataInit"))
    } else {
        localStorage.setItem("dataInit", JSON.stringify(initDT))
    }
    const [exData, setExdata] = useState(initDT)
    useEffect(() => {
        
        if (typeof (DatasetsArr.data) !== 'undefined') {
            // networkGrahGen(DataChge.chatsData.netData);
            bubbleChat(DatasetsArr.data, exData);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [DatasetsArr.data, exData.length])
    let nomStyles = {display: 'flex'};
    if (initKey) {
        nomStyles = {
            display: 'none',
            position: 'relative'
        }
    }

    const OpenFiles = () => {
        ingInpt.current?.click();
    }

    const delFun = (namex = "") => {
        if (_.isArray(exData)) {
            const holdTem = []
            // const nArr = []
            for (let d = 0; d < exData.length; d++) {
                if (namex !== exData[d].name) {
                    holdTem.push(exData[d])
                } 
            }

            setExdata(holdTem)
            localStorage.setItem("dataInit", JSON.stringify(holdTem))
        }
    }

    const restoreData = () => {
        console.log('hello');
        localStorage.removeItem("dataInit")
        setExdata(initialData[0])
    }
    const exTDataName = []
    return (
        <div className="NetworkPlotGraMain">
            <h3 className="NetworkPlotGRaHeader">
                Scalability view
            </h3>
            <div className="keyTooBobble">
                <div className="BubleContHolder">
                    <div className="key2BubbleC">
                        <div className="buubleCirleCont"/>
                        <div className="bubbleNameKey2">Below 0.4</div>
                    </div>
                    <div className="key2BubbleC">
                        <div className="buubleCirleCont" style={{width: "32px", height: "20px"}}/>
                        <div className="bubbleNameKey2">0.41 - 0.5</div>
                    </div>
                    <div className="key2BubbleC">
                        <div className="buubleCirleCont" style={{width: "40px", height: "26px"}} />
                        <div className="bubbleNameKey2">0.51 - 1</div>
                    </div>
                    <div className="key2BubbleC">
                        <div className="buubleCirleCont" style={{width: "50px", height: "30px"}}/>
                        <div className="bubbleNameKey2">1.1 - 1.5</div>
                    </div>
                    <div className="key2BubbleC">
                        <div className="buubleCirleCont" style={{width: "60px", height: "40px"}}/>
                        <div className="bubbleNameKey2">1.51 - 2</div>
                    </div>
                </div>
            </div>
            <div className="NewBubbleKeyHolder">
                <div className="KeyElemHolderbubble">
                    <div className="bubbleColorDiv" style={{backgroundColor: "blue"}} />
                    <div className="bubbleNameKeyName">Medi_sea</div>
                </div>
                <div className="KeyElemHolderbubble">
                    <div className="bubbleColorDiv" style={{backgroundColor: "yellow"}} />
                    <div className="bubbleNameKeyName">Mooloolaba</div>
                </div>
                <div className="KeyElemHolderbubble">
                    <div className="bubbleColorDiv" style={{backgroundColor: "orange"}} />
                    <div className="bubbleNameKeyName">East Atlantic</div>
                </div>
                <div className="KeyElemHolderbubble">
                    <div className="bubbleColorDiv" style={{backgroundColor: "gray"}} />
                    <div className="bubbleNameKeyName">Weipa</div>
                </div>
                <div className="KeyElemHolderbubble">
                    <div className="bubbleColorDiv" style={{backgroundColor: "brown"}} />
                    <div className="bubbleNameKeyName">Bowen</div>
                </div>
                <div className="KeyElemHolderbubble">
                    <div className="bubbleColorDiv" style={{backgroundColor: "green"}} />
                    <div className="bubbleNameKeyName">Urangan Tide</div>
                </div>
                <div className="KeyElemHolderbubble">
                    <div className="bubbleColorDiv" style={{backgroundColor: "pink"}} />
                    <div className="bubbleNameKeyName">Karumba</div>
                </div>
                <div className="KeyElemHolderbubble">
                    <div className="bubbleColorDiv" style={{backgroundColor: "purple"}} />
                    <div className="bubbleNameKeyName">Southport</div>
                </div>
            </div>
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
            <div className="SettingsBubbleComponents">
                <div className="SettingsbubbleButtonHolder">
                <input style={{ display: 'none' }}  type="file" ref={ingInpt} name="image1" accept=".csv" multiple />
                    <button className="SettingsbubbleButton" onClick={()=> OpenFiles()}>Upload Datasets</button>
                </div>
                <div className="DatasetsHistoryHolder">
                    <div className="DatasetHistHeader" onClick={()=> restoreData()}>History</div>
                    {
                        _.isArray(exData) && !_.isEmpty(exData)?
                        exData.map((vals)=> {

                            if (exTDataName.indexOf(vals.name) === -1) {
                                exTDataName.push(vals.name)
                                return <div className="DatasetOntheHist">
                                <div className="datasetHistName">
                                    {
                                        vals.name
                                    }
                                </div>
                                <button className="DeleteDatasetbutton" onClick={()=> delFun(vals.name)}>
                                    <span className="material-symbols-outlined">
                                        delete
                                    </span>
                                </button>
                            </div>
                            }
                            return <></>
                            
                            })
                        : <></>
                    }
                </div>
            </div>
        </div>
    );
}

export default NetworkPlotGra;
