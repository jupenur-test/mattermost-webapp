// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React from 'react';
import {FormattedMessage} from 'react-intl';
import {useSelector} from 'react-redux';

import TourTip, {useMeasurePunchouts} from 'components/widgets/tour_tip';

import {GlobalState} from 'types/store';
import {getIsMobileView} from 'selectors/views/browser';
import {ShortcutKey, ShortcutKeyVariant} from 'components/shortcut_key';
import {CrtTourManager as crtTourManager, nextAndPrevButton} from '../crt_tour_manager';
import Constants from 'utils/constants';

export const UpShortcut = () => (
    <ShortcutKey variant={ShortcutKeyVariant.TutorialTip}>{'UP'}</ShortcutKey>
);

export const DownShortcut = () => (
    <ShortcutKey variant={ShortcutKeyVariant.TutorialTip}>{'DOWN'}</ShortcutKey>
);

const CRTListTutorialTip = () => {
    const isMobileView = useSelector((state: GlobalState) =>
        getIsMobileView(state),
    );
    const title = (
        <FormattedMessage
            id='tutorial_threads.list.title'
            defaultMessage={'Threads List'}
        />
    );

    const screen = (
        <>
            <p>
                <FormattedMessage
                    id='tutorial_threads.list.description-p1'
                    defaultMessage={
                        'Here you’ll see a preview of all threads you’re following or participating in. Clicking on a thread in this list will open the full thread on the right.'
                    }
                />
            </p>
            <p>
                <FormattedMessage
                    id='tutorial_threads.list.description-p2'
                    defaultMessage={
                        'Use {upKey} / {downKey} to navigate the thread list.'
                    }
                    values={{
                        upKey: <UpShortcut/>,
                        downKey: <DownShortcut/>,
                    }}
                />
            </p>
        </>
    );

    const punchOutIds = isMobileView ? ['tutorial-threads-mobile-list', 'tutorial-threads-mobile-header'] : ['threads-list-container'];

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
            overlayPunchOut={useMeasurePunchouts(punchOutIds, [])}
            step={Constants.CrtTutorialSteps.LIST_POPOVER}
            placement='right-start'
            pulsatingDotPlacement='right'
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

export default CRTListTutorialTip;
