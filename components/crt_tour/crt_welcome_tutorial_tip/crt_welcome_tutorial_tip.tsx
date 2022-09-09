// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React from 'react';
import {FormattedMessage} from 'react-intl';

import {Constants} from 'utils/constants';
import {useMeasurePunchoutsDeprecated} from 'components/tutorial/tutorial_tip_legacy/hooks';
import {CrtTourManager as crtTourManager, nextAndPrevButton} from '../crt_tour_manager';
import TourTip from 'components/widgets/tour_tip';

const CRTWelcomeTutorialTip = () => {
    const title = (
        <FormattedMessage
            id='tutorial_threads.welcome.title'
            defaultMessage={'Welcome to the Threads view!'}
        />
    );

    const screen = (
        <p>
            <FormattedMessage
                id='tutorial_threads.welcome.description'
                defaultMessage={
                    'All the conversations that you’re participating in or following will show here. If you have unread messages or mentions within your threads, you’ll see that here too.'
                }
            />
        </p>
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
            overlayPunchOut={useMeasurePunchoutsDeprecated(
                ['sidebar-threads-button'],
                [],
            )}
            step={Constants.CrtTutorialSteps.WELCOME_POPOVER}
            placement='right-start'
            pulsatingDotPlacement='right-start'
            interactivePunchOut={true}
            tourSteps={tourSteps}
            nextBtn={nextAndPrevButton.nextBtn}
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

export default CRTWelcomeTutorialTip;
