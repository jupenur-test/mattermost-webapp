// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useState} from 'react';

import NotificationFromMembersModal from './notification_from_members_modal';

type Props = {
    postId: string;
    text: string;
    userIds: string[];
    messageMetadata: Record<string, string>;
}

function AtSumOfMembersMention(props: Props) {
    const [show, setShow] = useState(false);
    const closeModal = () => {
        setShow(false);
    };

    return (
        <>
            <NotificationFromMembersModal
                show={show}
                onHide={closeModal}
                userIds={props.userIds}
                feature={props.messageMetadata.requestedFeature}
            />
            <a
                id={`${props.postId}_at_sum_of_members_mention`}
                onClick={() => {
                    setShow(true);
                }}
            >
                {props.text}
            </a>
        </>

    );
}

export default AtSumOfMembersMention;
