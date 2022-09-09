// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React from 'react';
import {FormattedMessage} from 'react-intl';

import {Constants} from 'utils/constants';
import TourTip, {useMeasurePunchouts} from 'components/widgets/tour_tip';
import {CrtTourManager as crtTourManager, nextAndPrevButton} from '../crt_tour_manager';

const CRTUnreadTutorialTip = () => {
    const title = (
        <FormattedMessage
            id='tutorial_threads.unread.title'
            defaultMessage={'Unread threads'}
        />
    );

    const screen = (
        <p>
            <FormattedMessage
                id='tutorial_threads.unread.description'
                defaultMessage='You can switch to <b>Unreads</b> to show only threads that are unread.'
                values={{
                    b: (value: string) => <b>{value}</b>,
                }}
            />
        </p>
    );

    const finishButton = (
        <>
            <FormattedMessage
                id={'tutorial_tip.finish_tour'}
                defaultMessage={'Finish tour'}
            />
            <i className='icon icon-chevron-right'/>
        </>
    );

    const {
        show,
        tourSteps,
        handleOpen,
        handleDismiss,
        handleNext,
        handlePrevious,
        handleSkip,
        handleJump,
    } = crtTourManager();

    return (
        <TourTip
            show={show}
            title={title}
            showOptOut={false}
            screen={screen}
            overlayPunchOut={useMeasurePunchouts(
                ['threads-list-unread-button'],
                [],
            )}
            step={Constants.CrtTutorialSteps.UNREAD_POPOVER}
            placement='bottom'
            pulsatingDotPlacement='bottom'
            interactivePunchOut={true}
            tourSteps={tourSteps}
            nextBtn={finishButton}
            prevBtn={nextAndPrevButton.prevBtn}
            handleOpen={handleOpen}
            handleDismiss={handleDismiss}
            handleNext={handleNext}
            handlePrevious={handlePrevious}
            handleSkip={handleSkip}
            handleJump={handleJump}
        />
    );
};

export default CRTUnreadTutorialTip;
