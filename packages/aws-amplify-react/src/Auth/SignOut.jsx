/*
 * Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 *     http://aws.amazon.com/apache2.0/
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */

import * as React from 'react';
import { I18n, ConsoleLogger as Logger } from '@aws-amplify/core';
import Auth from '@aws-amplify/auth';

import AuthPiece from './AuthPiece';
import { NavButton } from '../Amplify-UI/Amplify-UI-Components-React';
import AmplifyTheme from '../Amplify-UI/Amplify-UI-Theme';

import Constants from './common/constants';

const logger = new Logger('SignOut');

export default class SignOut extends AuthPiece {
    constructor(props) {
        super(props);

        this.signOut = this.signOut.bind(this);

        this.state = {
            authState: props.authState,
            authData: props.authData
        };
    }

    signOut() {
        let payload = {};
        try {
            payload = JSON.parse(localStorage.getItem(Constants.AUTH_SOURCE_KEY)) || {};
            localStorage.removeItem(Constants.AUTH_SOURCE_KEY);
        } catch (e) {
            logger.debug(`Failed to parse the info from ${Constants.AUTH_SOURCE_KEY} from localStorage with ${e}`);
        }
        logger.debug('sign out from the source', payload);
        const { googleSignOut, facebookSignOut, amazonSignOut } = this.props;
        switch (payload.provider) {
            case Constants.GOOGLE:
                if (googleSignOut) googleSignOut();
                else logger.debug('No google signout method provided');
                break;
            case Constants.FACEBOOK:
                if (facebookSignOut) facebookSignOut();
                else logger.debug('No facebook signout method provided');
                break;
            case Constants.AMAZON:
                if (amazonSignOut) amazonSignOut();
                else logger.debug('No amazon signout method provided');
                break;
            default:
                break;
        }

        if (!Auth || typeof Auth.signOut !== 'function') {
            throw new Error('No Auth module found, please ensure @aws-amplify/auth is imported');
        }
        Auth.signOut()
            .then(() => this.changeState('signedOut'))
            .catch(err => { logger.error(err); this.error(err); });
    }

    render() {
        const { hide } = this.props;
        if (hide && hide.includes(SignOut)) { return null; }

        const { authState } = this.state;
        const signedIn = (authState === 'signedIn');

        const theme = this.props.theme || AmplifyTheme;
        if (!signedIn) { return null; }

        return (
            <NavButton
                theme={theme}
                onClick={this.signOut}
            >
                {I18n.get('Sign Out')}
            </NavButton>
        );
    }
}
