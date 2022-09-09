// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {FormattedMessage} from 'react-intl';

import {getCurrentUserId} from 'mattermost-redux/selectors/entities/common';
import {GlobalState} from 'types/store';
import {getInt} from 'mattermost-redux/selectors/entities/preferences';
import {Constants, Preferences} from 'utils/constants';
import {savePreferences} from 'mattermost-redux/actions/preferences';
import {
    CrtTutorialSteps,
    FINISHED,
    getLastStep,
    isKeyPressed,
    KeyCodes,
    SKIPPED,
    TutorialTourName,
} from 'components/onboarding_tour';

export const nextAndPrevButton = {
    nextBtn: (
        <>
            <FormattedMessage
                id={'tutorial_tip.ok'}
                defaultMessage={'Next'}
            />
            <i className='icon icon-chevron-right'/>
        </>
    ),
    prevBtn: (
        <>
            <i className='icon icon-chevron-left'/>
            <FormattedMessage
                id='generic.previous'
                defaultMessage='Previous'
            />
        </>
    ),
};

export interface CRTTourTipManager {
    show: boolean;
    currentStep: number;
    tourSteps: Record<string, number>;
    handleOpen: (e: React.MouseEvent) => void;
    handleSkip: (e: React.MouseEvent) => void;
    handleDismiss: (e: React.MouseEvent) => void;
    handlePrevious: (e: React.MouseEvent) => void;
    handleNext: (e: React.MouseEvent) => void;
    handleJump: (e: React.MouseEvent, jumpStep: number) => void;
}

export const CrtTourManager = (): CRTTourTipManager => {
    const [show, setShow] = useState(false);
    const tourSteps = CrtTutorialSteps;
    const tourCategory = TutorialTourName.CRT_TUTORIAL_STEP;

    const dispatch = useDispatch();
    const currentUserId = useSelector(getCurrentUserId);
    const currentStep = useSelector((state: GlobalState) =>
        getInt(
            state,
            Preferences.CRT_TUTORIAL_STEP || Preferences.TUTORIAL_STEP,
            currentUserId,
            0,
        ),
    );

    const isAutoTourEnabled =
        useSelector((state: GlobalState) =>
            getInt(
                state,
                Preferences.CRT_TUTORIAL_AUTO_TOUR_STATUS,
                currentUserId,
                Constants.AutoTourStatus.ENABLED,
            ),
        ) === Constants.AutoTourStatus.ENABLED;

    const handleEventPropagationAndDefault = (
        e: React.MouseEvent | KeyboardEvent,
    ) => {
        e.stopPropagation();
        e.preventDefault();
    };

    const handleSaveDataAndTrackEvent = useCallback(
        (stepValue: number) => {
            const preferences = [
                {
                    user_id: currentUserId,
                    category: tourCategory,
                    name: currentUserId,
                    value: stepValue.toString(),
                },
            ];
            dispatch(savePreferences(currentUserId, preferences));
        },
        [currentUserId, tourCategory],
    );

    useEffect(() => {
        if (isAutoTourEnabled) {
            setShow(true);
        }
    }, [isAutoTourEnabled]);

    const handleHide = useCallback((): void => {
        setShow(false);
    }, []);

    const handleOpen = useCallback(
        (e: React.MouseEvent): void => {
            handleEventPropagationAndDefault(e);
            setShow(true);
        },
        [],
    );

    const handleSavePreferences = useCallback(
        (nextStep: boolean | number): void => {
            let stepValue = currentStep;
            if (nextStep === true) {
                stepValue += 1;
            } else if (nextStep === false) {
                stepValue -= 1;
            } else {
                stepValue = nextStep;
            }
            handleHide();
            handleSaveDataAndTrackEvent(stepValue);
        },
        [currentStep, handleHide, handleSaveDataAndTrackEvent],
    );

    const handleDismiss = useCallback(
        (e: React.MouseEvent): void => {
            handleEventPropagationAndDefault(e);
            handleHide();
            handleSaveDataAndTrackEvent(currentStep);
        },
        [currentStep, handleSaveDataAndTrackEvent, handleHide],
    );

    const handlePrevious = useCallback(
        (e: React.MouseEvent): void => {
            handleEventPropagationAndDefault(e);
            handleSavePreferences(false);
        },
        [handleSavePreferences],
    );

    const handleNext = useCallback(
        (e?: React.MouseEvent): void => {
            if (e) {
                handleEventPropagationAndDefault(e);
            }
            if (getLastStep(tourSteps) === currentStep) {
                handleSavePreferences(FINISHED);
            } else {
                handleSavePreferences(true);
            }
        },
        [currentStep, tourSteps, handleSavePreferences],
    );

    const handleJump = useCallback(
        (e: React.MouseEvent, jumpStep: number): void => {
            if (e) {
                handleEventPropagationAndDefault(e);
            }
            handleSavePreferences(jumpStep);
        },
        [handleSavePreferences],
    );

    const handleSkip = useCallback(
        (e: React.MouseEvent): void => {
            handleEventPropagationAndDefault(e);
            handleHide();
            handleSaveDataAndTrackEvent(SKIPPED);
        },
        [handleSaveDataAndTrackEvent, handleHide],
    );

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent): void => {
            if (isKeyPressed(e, KeyCodes.ENTER) && show) {
                handleNext();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleNext, show]);

    return {
        show,
        currentStep,
        tourSteps,
        handleOpen,
        handleDismiss,
        handleNext,
        handleJump,
        handlePrevious,
        handleSkip,
    };
};
