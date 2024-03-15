import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendToBackendPost } from '../../funs/apiCall';
import { getCurrentDateTime } from '../../funs/SharedFun';
import { reloadAllAdminData } from '../../redux/action/expo';
import { updateChatsData, changeActiveDataset } from '../../redux/action/datasetsActs';
import { socket } from '../../socket';
import './sideNav.css';
import userProfile from '../../images/theresia.jpeg';
import logo from '../../images/logo.svg';
import git from '../../images/github.svg';
import './topNav.css';
// import SlidingPanel from 'react-sliding-side-panel';
import ReactSlidingPane from 'react-sliding-pane';
import { Link } from 'react-router-dom';
// actions
import { activatePopup } from '../../redux/action/popupActions';
import _ from 'lodash';
import Stopwatch from './StopWatch';
import PlusMinus from './PlusMinus';

function TopNav() {
    const [openPanel, setOpenPanel] = useState(false);
    const openCloseSideBar = () => {
        if(openPanel) {
            setOpenPanel(false);
        }else {
            setOpenPanel(true);
        }
    }

    // side nav
    const OpenFiles = () => {
        imgInpt.current?.click();
    }
    const [uploadCont, setUploadCont] = useState({dataset: null, project_name: '', passcode: 'theresia_is_on_wechat_07_24_08_2023'})
    const imgInpt = useRef(null);
    const activeData = useSelector((state) => state.DataSetReduc.activeDataset);
    const DatasetsArr = useSelector((state) => state.DataSetReduc.datasetsInfo);
    const dispatch = useDispatch();
    const formSubmitUpload = async (e)  =>{
        e.preventDefault();
        const formdata = new FormData();
        if (uploadCont.dataset === null || uploadCont.dataset === '' || uploadCont.project_name === '' || uploadCont.project_name.length < 5) {
            console.log(uploadCont);
            dispatch(activatePopup('error', { head: 'Error!', text: 'Make sure all data are set and Project name length is more than 5 characters' })); 
            return false;  
        }
        formdata.append('dataset', uploadCont.dataset);
        formdata.append('project_name', uploadCont.project_name);
        formdata.append('passcode', uploadCont.passcode);

        dispatch(activatePopup('loading', { text: 'loading data...' }));
        const ansbck = await sendToBackendPost('/dataupload', formdata);
        console.log(ansbck);
        if (typeof (ansbck) === 'object' && ansbck.state === 'success') {
            
            if (typeof (ansbck.data) === 'string') {
                dispatch(activatePopup('info', { head: 'Success', text: ansbck.data }));
            } else {
                dispatch(activatePopup('info', { head: 'Success', text: 'Datasets were successfully uploaded' }));
            }
            setTimeout(() => {
                dispatch(reloadAllAdminData(Math.random()));
            }, 3000);
        } else if (typeof (ansbck) === 'object' && ansbck.state !== 'success') {
            if (typeof (ansbck.data) === 'string') {
                dispatch(activatePopup('error', { head: ansbck.state, text: ansbck.data }));
            } else {
                dispatch(activatePopup('error', { head: ansbck.state, text: 'Something went wrong' }));
            }
        } else if (typeof (ansbck) ===  'string') {
            dispatch(activatePopup('error', { head: 'Error!', text: ansbck }));
        }else {
            dispatch(activatePopup('error', { head: 'Error!', text: 'failed to perform this action' }));
        } 
    }

    const [isConnected, setIsConnected] = useState(socket.connected);
    const [startEndTime, setStartEndTime] = useState({end: 'stopped', start: 'stopped'});
    const [activeNumDat, setActiveNumb] = useState(0);
    const [isrunning, setIsRunning] = useState(false);
    const [cureeInf, setCurrEInf] = useState({mae: 0, acc: 0, epoch: 0, rsme: 0, desired: 'Auto Selected'});
    const [isShowingOutput, setShowingOutput] = useState(false);
    let saveData = {
        ensemb: [],
        netData: [],
        predData: [],
        len: 200,
        mae: 0.0,
        acc: 0.0,
        epoch: 0
    }
    const settings = {
        batches: 10,
        iteration: 30
    }
    let startTime = '';

    const changeSettingsFun = (val, variableName) =>{
        if (typeof (val) !== 'number') {
            val = 20;
        }
        settings[variableName] = val;
    }

    const playModelRun = async () => {
        saveData = {
            ensemb: [],
            netData: [],
            predData: [],
            len: 200,
            mae: 0.0,
            acc: 0.0,
            epoch: 0
        }
        if (!isConnected) {
            dispatch(activatePopup('error', { head: 'Connection Error!', text: 'For some reasons you are not connected' }));
            return false;
        }
        // check if there is any active dataset
        if (_.isEmpty(activeData)) {
            dispatch(activatePopup('error', { head: 'Error!', text: 'No active dataset, Please upload one or reload the page if you have done already' }));
            return false;
        }
        if (isrunning) {
            const pauseInfo = {
                'info': 'pause'
            };
            socket.emit('pause_model', JSON.stringify(pauseInfo));
            return 0;
        }
        
        const playData = {
            ...settings,
            passcode: 'theresia_is_on_wechat_07_24_08_2023',
            project_id: activeData.dataset.dataset_id
        }
        console.log(playData);
        setIsRunning(true);
        socket.emit('play_model', JSON.stringify(playData));
    }
    
    const sortDataAndSave = (data) => {
        
        if (typeof (data.state) !== 'undefined' && data.state === 'starting') {
            startTime = getCurrentDateTime();
            setStartEndTime({start: startTime, end: 'running ....'})
            saveData = {
                ensemb: [],
                netData: [],
                predData: [],
                len: 200,
                mae: 0.0,
                acc: 0.0,
                epoch: 0
            }
            return false;
        }
        else if (typeof (data.state) !== 'undefined' && (data.state === 'end' || data.state === 'ending' )) {
            setIsRunning(false);
            setStartEndTime({start: startTime, end: getCurrentDateTime()});
            return false;
        } else if (typeof (data.state) !== 'undefined' && data.state !== 'success') {
            setIsRunning(false);
            setStartEndTime({start: startTime, end: getCurrentDateTime()});
            saveData = {
                ensemb: [],
                netData: [],
                predData: [],
                len: 200,
                mae: 0.0,
                acc: 0.0,
                epoch: 0
            }
            if (typeof (data.data) === 'string') {
                dispatch(activatePopup('error', { head: 'Error!', text: data.data }));
                return false;
            }
            dispatch(activatePopup('error', { head: 'Error!', text: 'Operation has failed' }));
        } else if (typeof (data.state) === 'undefined') {
            saveData = {
                ensemb: [],
                netData: [],
                predData: [],
                len: 200,
                mae: 0.0,
                acc: 0.0,
                epoch: 0
            }
            dispatch(activatePopup('error', { head: 'Error!', text: 'Operation has failed' }));
        }
        // now work on the data
        saveData.ensemb.push(data.data.ensemble);
        if (_.isArray(data.data.netData)) {
            saveData.netData = [...saveData.netData, ...data.data.netData];
        }
        if (_.isArray(data.data.predictions)) {
            saveData.predData =[...saveData.predData,  ...data.data.predictions];
        }
        saveData.len = data.data.len;
        saveData.acc = data.data.acc;
        saveData.epoch = data.data.epoch;
        saveData.mae = data.data.mae;
        setCurrEInf({ mae: data.data.mae, epoch: data.data.epoch, acc: data.data.acc, desired: data.data.desire, rsme: data.data.rmse})
        dispatch(updateChatsData(saveData));
    }

    const changeActiveData = (path) =>{
        if (typeof (DatasetsArr) !== 'object' || _.isEmpty(DatasetsArr) || !_.isArray(DatasetsArr.data) || _.isEmpty(DatasetsArr.data)) {
            dispatch(activatePopup('info', { head: 'Info!', text: 'No datasets to scroll' }));
            return 0;
        }
        const len = DatasetsArr.data.length;
        if (path === 'forward') {
            if (activeNumDat >= (len - 1)) {
                dispatch(activatePopup('info', { head: 'Info!', text: 'You have reached the end of the list' }));
                return 0;
            }
            if (typeof (DatasetsArr.data[activeNumDat+1]) !== 'undefined') {
                setActiveNumb(activeNumDat+1);
                dispatch(changeActiveDataset(DatasetsArr.data[activeNumDat+1]));
                setIsBlinking(true)
                return 0;
            }
            dispatch(activatePopup('error', { head: 'Error!', text: 'Unknown error' }));
        } else {
            if (activeNumDat <= 0) {
                dispatch(activatePopup('info', { head: 'Info!', text: 'You have reached the end of the list' }));
                return 0;
            }
            if (typeof (DatasetsArr.data[activeNumDat-1]) !== 'undefined') {
                setActiveNumb(activeNumDat-1);
                setIsBlinking(true)
                dispatch(changeActiveDataset(DatasetsArr.data[activeNumDat-1]));
                return 0;
            }
            dispatch(activatePopup('error', { head: 'Error!', text: 'Unknown error -1' }));
        }
    }

    const handlePauseEvent = (value) => {
        if (typeof (value.state) !== 'undefined' && value.state !== 'success') {
            dispatch(activatePopup('error', { head: 'Error!', text: 'Unable to Stop the successfuly' }));
            return 0;
        } else if (typeof (value.state) === 'undefined'){
            dispatch(activatePopup('error', { head: 'Error!', text: 'Unable to Stop the successfuly -2' }));
            return 0
        }
        setIsRunning(false);
    }

    const [isBlinking, setIsBlinking] = useState(false);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
          setIsBlinking(false);
        }, 1000); // Set the timeout for one second
    
        return () => {
          clearTimeout(timeoutId);
        };
    }, [isBlinking]);

    useEffect(() => {
        function onConnect() {
            setIsConnected(true);
        }

        function onDisconnect() {
            setIsConnected(false);
        }

        function onPlayModel(value) {
            sortDataAndSave(JSON.parse(value))
        }

        function onPauseModel(value) {
            handlePauseEvent(JSON.parse(value));
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('play_model', onPlayModel);
        socket.on('pause_model', onPauseModel);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('play_model', onPlayModel);
            socket.off('pause_model', onPauseModel);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [activeSection, setActiveSection] = useState('home');
    return (
        <div className="topNavMain">
            <div className="topNavContantHolder">
                <div className="leftSectTopNav">
                    <div className="UserDetailsSectionsTopNav" style={{display: 'none'}}>
                        <img src={userProfile} alt="userProfile" className="userprofilePictTopNav" />
                        <div className="userTextDetailsHolder">
                            <div className="userNameTopNav">
                                Theresia F. Mwita
                            </div>
                            <div className="userTitleTopNav">
                                Project Manager
                            </div>
                        </div>
                    </div>
                    <div className="MenuButtnSecTopNav">
                        <button type="button" className="MenyeButtonTopNav" onClick={() => openCloseSideBar()}>
                            <span className="material-symbols-outlined">
                                {
                                    openPanel ? 'close' : 'apps'
                                }
                            </span>
                        </button>
                    </div>
                    <div className="ProjectNameNLogo">
                        <img src={logo} className="projectLogoSideNav" alt="Logo" />
                        <h2 className="ProjectName textColorNormal">STCANetViz</h2>
                    </div>
                </div>
                <div className="middleSectTopNav">
                    <div className="ModelNameDisplay" style={{display: 'none'}}>
                        <div className="ModelTitleDisp">
                            Model:
                        </div>
                        <div className="ModelNameDisp">
                            Sea Wave Prediction
                        </div>
                    </div>
                    <div className="calernderTopNav" style={{display: 'none'}}>
                        <div className="iconCalendertopNav">
                            Epochs:
                        </div>
                        <div className="DatevalueCalenderTopNav">
                            1840
                        </div>
                    </div>
                </div>
                <div className="rightSectTopNav">
                    <div className="actionsTopNav"> 
                        <div className="actionIconHolderTopNav lightGrayColor activeActionTopNav" style={{display: 'none'}}>
                            <span className="material-symbols-outlined">
                                settings_input_antenna
                            </span>
                        </div>
                        <a href="https://github.com/tess74/STCANetVis-2023">
                            <div className="actionIconHolderTopNav lightGrayColor">
                                <img src={git} className="gitIconActionIcons" alt="github icon" />
                            </div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="sidePanelMain">
                <ReactSlidingPane
                    width="300px"
                    overlayClassName={`SlidePaneOverLay ${openPanel ? 'SlidePaneOverLayOn': ''}`}
                    className="SidePanaleMain"
                    from="left"
                    hideHeader={true}
                    isOpen={openPanel}
                    onRequestClose={() =>{
                        setOpenPanel(false);
                    }}
                >
                    <div className="slidePanelContentHolder">
                        <div className="NavigationButtons">
                            <Link to="/">
                                <button type="button" onClick={() => setActiveSection('home')} className={`SideNavigatorButtons ${activeSection === 'home' ? 'activeSideNav' : ''}`}>
                                    <div className="SideNavigatorButtonContHolder">
                                        <div className="IconHolderNavigotorButton">
                                            <span className="material-symbols-outlined">
                                                home_app_logo
                                            </span>
                                        </div>
                                        <div className="textHolderNaviButton">Home</div>
                                        <div className="arrowHolderActiveSideNavButton">
                                            <span className="material-symbols-outlined">
                                                arrow_forward_ios
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            </Link>
                            <Link to="/predict">
                                <button type="button" onClick={() => setActiveSection('predict')} className={`SideNavigatorButtons ${activeSection === 'predict' ? 'activeSideNav' : ''}`}>
                                    <div className="SideNavigatorButtonContHolder">
                                        <div className="IconHolderNavigotorButton">
                                            <span className="material-symbols-outlined">
                                                online_prediction
                                            </span>
                                        </div>
                                        <div className="textHolderNaviButton">Prediction View</div>
                                        <div className="arrowHolderActiveSideNavButton">
                                            <span className="material-symbols-outlined">
                                                arrow_forward_ios
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            </Link>
                            <Link to="/data_unce">
                                <button type="button" onClick={() => setActiveSection('data')} className={`SideNavigatorButtons ${activeSection === 'data' ? 'activeSideNav' : ''}`}>
                                    <div className="SideNavigatorButtonContHolder">
                                        <div className="IconHolderNavigotorButton">
                                            <span className="material-symbols-outlined">
                                                monitoring
                                            </span>
                                        </div>
                                        <div className="textHolderNaviButton">Uncertainty View </div>
                                        <div className="arrowHolderActiveSideNavButton">
                                            <span className="material-symbols-outlined">
                                                arrow_forward_ios
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            </Link>
                            <Link to="/network">
                                <button type="button" onClick={() => setActiveSection('network')} className={`SideNavigatorButtons ${activeSection === 'network' ? 'activeSideNav' : ''}`}>
                                    <div className="SideNavigatorButtonContHolder">
                                        <div className="IconHolderNavigotorButton">
                                            <span className="material-symbols-outlined">
                                                hub
                                            </span>
                                        </div>
                                        <div className="textHolderNaviButton">Scalability view</div>
                                        <div className="arrowHolderActiveSideNavButton">
                                            <span className="material-symbols-outlined">
                                                arrow_forward_ios
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            </Link>
                        </div>
                    </div>
                    {/* side nav */}
                    <div className="MainSideNav ">
                        <div className="ContentHolderSideNav">
                            <div className="ModelTrainSummarySideNav">
                                <h3 className="SummaryHeaderSideNav">
                                    Optimization Overview
                                </h3>
                                <div className={`OptimatzationSummmaryContHolder ${isBlinking ? 'blue-background' : ''}` } style={{transition: 'background-color 0.3s ease'}}>
                                    <div className="OptimazationSummaryHeader">
                                        Parameter Settings
                                    </div>
                                    <div className="OptimazationRowDivSideNav">
                                        <div className="titleParameterOptSideNav">
                                            Framework:
                                        </div>
                                        <div className="OptimazationValueSizeNav">
                                            STCANetViz
                                        </div>
                                    </div>
                                    {/* helloe spacer */}
                                    <div className="OptimazationRowDivSideNav">
                                        <div className="titleParameterOptSideNav">
                                            Dataset Name:
                                        </div>
                                        <div className="OptimazationValueSizeNav" style={{fontWeight: '600'}}>
                                            {
                                                !_.isEmpty(activeData)
                                                ? activeData.dataset.project_name
                                                : 'No uploaded data'
                                            }
                                        </div>
                                    </div>
                                    {/* helloe spacer */}
                                    <div className="OptimazationRowDivSideNav">
                                        <div className="titleParameterOptSideNav">
                                            Desired Value:
                                        </div>
                                        <div className="OptimazationValueSizeNav" style={{fontWeight: '600'}}>
                                            {
                                                cureeInf.desired
                                            }
                                        </div>
                                    </div>
                                    {/* helloe spacer */}
                                    <div className="OptimazationRowDivSideNav">
                                        <PlusMinus
                                            low={20}
                                            high={400}
                                            changeFun={changeSettingsFun}
                                            variable="batches"
                                            name="Batches:"
                                        />
                                    </div>
                                    {/* helloe spacer */}
                                    <div className="OptimazationRowDivSideNav" style={{marginTop: '5px'}}>
                                        <PlusMinus
                                            low={20}
                                            high={200}
                                            changeFun={changeSettingsFun}
                                            variable="iteration"
                                            name="Max Iterations:"
                                        />
                                    </div>
                                    <div className="OutputShowButtonHolderSideNav">
                                        <div className="TextExplanationOutputShowButton">{ isShowingOutput ? 'Hide' : 'Show'} outputs</div>
                                        <button className="OutputShowButtonSideNav" onClick={() => setShowingOutput(!isShowingOutput)}>
                                            { isShowingOutput ? 'Hide' : 'Show'}
                                        </button>
                                    </div>
                                    <div className="OutShowSectionSideNav" style={isShowingOutput ? {} : { display: 'none' }}>
                                        <div className="OptimazationSummaryHeader SpaceTopMargin">
                                            OUTPUT
                                        </div>
                                        <div className="OptimazationRowDivSideNav">
                                            <div className="titleParameterOptSideNav">
                                                Start Time:
                                            </div>
                                            <div className="OptimazationValueSizeNav">
                                                {
                                                    startEndTime.start
                                                }
                                            </div>
                                        </div>
                                        <div className="OptimazationRowDivSideNav">
                                            <div className="titleParameterOptSideNav">
                                                End Time:
                                            </div>
                                            <div className="OptimazationValueSizeNav">
                                                {
                                                    startEndTime.end
                                                }
                                            </div>
                                        </div>
                                        <div className="OptimazationRowDivSideNav">
                                            <div className="titleParameterOptSideNav">
                                                R_square:
                                            </div>
                                            <div className="OptimazationValueSizeNav">
                                                {cureeInf.acc }
                                            </div>
                                        </div>
                                        <div className="OptimazationRowDivSideNav">
                                            <div className="titleParameterOptSideNav">
                                                MAE:
                                            </div>
                                            <div className="OptimazationValueSizeNav">
                                                {
                                                    cureeInf.mae
                                                }
                                            </div>
                                        </div>
                                        <div className="OptimazationRowDivSideNav">
                                            <div className="titleParameterOptSideNav">
                                                RMSE:
                                            </div>
                                            <div className="OptimazationValueSizeNav">
                                                {
                                                    cureeInf.rsme
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="searchSectionTopNav">
                                <div className="SearchDivHoldr">
                                    <Stopwatch isRunning={isrunning} />
                                </div>
                            </div>
                            <div className="controlsSectionSideNav">
                                <h4 className="PlayPauseHderSideNav">Run Controls</h4>
                                <div className="PlayPauseButtonGroupSideNav">
                                    <button className="ForwardBackwardButtonsSideNav tooltipContHolder" onClick={() => changeActiveData('rewind')}>
                                        <span className="material-symbols-rounded">
                                            skip_previous
                                        </span>
                                        <span className="tooltiptext" >Go to the previous dataset</span>
                                    </button>
                                    <button className="PlayPauseButtonSideNav tooltipContHolder" onClick={()=> playModelRun()}>
                                        <span className="material-symbols-rounded">
                                            {
                                                isrunning ? 'stop' : 'play_arrow'
                                            }
                                            
                                        </span>
                                        <span className="tooltiptext" >Play to run model</span>
                                    </button>
                                    <button className="ForwardBackwardButtonsSideNav tooltipContHolder" onClick={() => changeActiveData('forward')}>
                                        <span className="material-symbols-rounded">
                                            skip_next
                                        </span>
                                        <span className="tooltiptext" >Go to the next dataset</span>
                                    </button>
                                </div>
                            </div>
                            <div className="DatasetUploadSectHolderControls">
                                <div className="FormHeaderControls">
                                    Upload Dataset
                                </div>
                                <form className="datasetUploadFormControls" onSubmit={(e) => formSubmitUpload(e)}>
                                    <input style={{ display: 'none' }}  type="file" ref={imgInpt} name="image1" accept=".csv" onChange={(e) => setUploadCont({...uploadCont, project_name: typeof (e.target.files[0]) !== 'undefined' ? e.target.files[0].name : '', dataset: e.target.files[0]})} />
                                    <button type="button" className="AttachMentButtonControls tooltipContHolder" onClick={() => OpenFiles()}>
                                        <span className="material-symbols-outlined">
                                            attach_file
                                        </span>
                                        <span className="tooltiptext" >Select Dataset</span>
                                    </button>
                                    <input type="text" placeholder="Dataset name" className="ProjectNameInputControls lightGrayColor" value={uploadCont.dataset !== null ? uploadCont.dataset.name : ''} onChange={(ec => setUploadCont({...uploadCont, project_name: ec.target.value}))} />
                                    <button type="submit" className="SubmitButtonProjectDetails tooltipContHolder">
                                        <span className="material-symbols-outlined">
                                            send
                                        </span>
                                        <span className="tooltiptext" >Upload datasets</span>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </ReactSlidingPane>
                {/* <div className="SideNavHolderHideShoe">
                        <SideNav />
                </div> */}
            </div>
        </div>
    );
}

export default TopNav;