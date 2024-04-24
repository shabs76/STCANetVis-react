import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import './networkPlotGre.css';
// import { networkGrahGen } from '../../funs/networkGraphGen';
import { bubbleChat } from '../../funs/bubbleChatGen';
import { initialData } from '../../funs/specials';
import { activatePopup, deactivatePopup } from '../../redux/action/popupActions';

function NetworkPlotGra({
    statx
}) {
    const dispatch = useDispatch();
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

    const uploadDataset = (e) => {
        if (!_.isObject(e) || _.isEmpty(e)) {
            return 0;
        }

        dispatch(activatePopup('loading', { text: 'loading dataset...' }));

        
        
        const fName = removeFileExtension(e[0].name);
        dispatch(activatePopup('loading', { text: 'loading '+fName+' dataset...' }));
        setTimeout(()=>{
            dispatch(deactivatePopup());
            processDataUp(fName);
        }, Math.ceil(Math.random() * 3454)+1500);

        
    }

    const processDataUp = (fName) => {
        const sampleNames = [
            "Medi_sea", "Mooloolaba", "East Atlantic", "Weipa", "Bowen", "Urangan Tide", "Karumba", "Southport",
        ];
        let tempHold = [];
        // loop to check if name exists
        let dtCapture = [];
        let dtCapture2 = [];
        let found = false;
        const genNm = Math.ceil(Math.random() * 16);
        for (let index = 0; index < initialData.length; index++) {
            const element = initialData[index];
            const element2 = {...element};
            if (element.name === fName) {
                console.log(element);
                found = true;
                dtCapture.push(element);
                element2.rows = element2.rows*1.092;
                element2.scalabilityInteraction = element2.scalabilityInteraction*1.063;
                element2.name = element2.name+"("+genNm+")"
                dtCapture2.push(element2);
                console.log(element);
            }
        }

        // if found now check if exists in display
        if (found) {
            // loop in the existing list
            for (let inx = 0; inx < exData.length; inx++) {
                const element = exData[inx];
                if (element.name === fName) {
                    tempHold = exData
                    tempHold = tempHold.concat(...dtCapture2);
                    setExdata(tempHold);
                    localStorage.setItem("dataInit", JSON.stringify(tempHold));
                    ingInpt.current.value = "";
                    return
                }
            }
            // not found just insert
            let tempHoldx = exData
            tempHoldx = tempHoldx.concat(...dtCapture);
            setExdata(tempHoldx);
            localStorage.setItem("dataInit", JSON.stringify(tempHoldx));
            ingInpt.current.value = "";
            return
        }

        // now deal with it as non existen 
        const randomNumber = Math.floor(Math.random() * 8);// Generate a random number between 0 and 7 (inclusive)
        let selectedDt = "East Atlantic";
        if (randomNumber>= 0 && sampleNames.length >= randomNumber) {
            selectedDt = sampleNames[randomNumber];
        }

        // loop to find selected data and get its value
        for (let inv = 0; inv < initialData.length; inv++) {
            const element = initialData[inv];
            if (element.name === selectedDt) {
                element.rows = element.rows*1.132;
                element.scalabilityInteraction = element.scalabilityInteraction*1.263;
                element.name = fName;
                element.color = "red";
                dtCapture2.push(element);
            }
            
        }
        tempHold = exData;
        tempHold = tempHold.concat(...dtCapture2);
        setExdata(tempHold);
        localStorage.setItem("dataInit", JSON.stringify(tempHold));
        ingInpt.current.value = "";
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

    function removeFileExtension(fileName) {
        // Find the last occurrence of '.' to determine the position of the file extension
        const extensionIndex = fileName.lastIndexOf('.');
        
        // If there's no '.', return the original fileName
        if (extensionIndex === -1) {
            return fileName;
        }
        
        // Extract the file name without the extension
        const nameWithoutExtension = fileName.substring(0, extensionIndex);
        
        return nameWithoutExtension;
    }
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
                <input style={{ display: 'none' }} onChange={(e) => uploadDataset(e.target.files)}  type="file" ref={ingInpt} name="image1" accept=".csv" multiple />
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
