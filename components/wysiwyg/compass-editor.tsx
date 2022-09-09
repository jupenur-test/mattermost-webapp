// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ChangeEvent} from 'react';
import styled from 'styled-components';

const CompassEditorWrapper = styled.div`
    border: 1px solid rgba(var(--center-channel-color-rgb), 0.56);
    padding: 8px;
`;

type Props = {
    value: string;
    onChange?: (msg: string) => void;
}

const CompassEditor = (props: Props) => {
    const handleChange = (event: ChangeEvent<HTMLDivElement>) => {
        console.log(' ####### do something on change', event);
        props.onChange?.(event.currentTarget.value);
    };
    return (
        <CompassEditorWrapper>
            <div contentEditable={true}>{props.value}</div>
        </CompassEditorWrapper>
    );
};

export default CompassEditor;
