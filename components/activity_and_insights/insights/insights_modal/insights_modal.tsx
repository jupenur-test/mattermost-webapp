// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React, {memo, useState, useCallback} from 'react';

import {Modal} from 'react-bootstrap';

import {TimeFrames, InsightsWidgetTypes} from '@mattermost/types/insights';

import {localizeMessage} from 'utils/utils';
import TimeFrameDropdown from '../time_frame_dropdown/time_frame_dropdown';
import TopReactionsTable from '../top_reactions/top_reactions_table/top_reactions_table';

import './../../activity_and_insights.scss';
import './insights_modal.scss';

type Props = {
    onExited: () => void;
    widgetType: InsightsWidgetTypes;
    title: string;
    subtitle: string;
}

const InsightsModal = (props: Props) => {
    const [show, setShow] = useState(true);
    const [timeFrame, setTimeFrame] = useState({
        value: TimeFrames.INSIGHTS_7_DAYS,
        label: localizeMessage('insights.timeFrame.mediumRange', 'Last 7 days'),
    });

    const setTimeFrameValue = useCallback((value) => {
        setTimeFrame(value);
    }, []);

    const doHide = useCallback(() => {
        setShow(false);
    }, []);

    const modalContent = useCallback(() => {
        switch (props.widgetType) {
        case InsightsWidgetTypes.TOP_CHANNELS:
            return null;
        case InsightsWidgetTypes.TOP_REACTIONS:
            return (
                <TopReactionsTable/>
            );
        default:
            return null;
        }
    }, [props.widgetType]);

    return (
        <Modal
            dialogClassName='a11y__modal insights-modal'
            show={show}
            onHide={doHide}
            onExited={props.onExited}
            aria-labelledby='insightsModalLabel'
            id='insightsModal'
        >
            <Modal.Header closeButton={true}>
                <div className='title-section'>
                    <Modal.Title
                        componentClass='h1'
                        id='insightsModalTitle'
                    >
                        {props.title}
                    </Modal.Title>
                    <div className='subtitle'>
                        {props.subtitle}
                    </div>
                </div>
                <TimeFrameDropdown
                    timeFrame={timeFrame}
                    setTimeFrame={setTimeFrameValue}
                />
            </Modal.Header>
            <Modal.Body
                className='overflow--visible'
            >
                {modalContent()}
            </Modal.Body>
        </Modal>
    );
};

export default memo(InsightsModal);