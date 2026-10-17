import React from 'react';
import {Composition} from 'remotion';
import {Campaign} from './video';
import {video} from './config';
import './style.css';

export const Root: React.FC = () => <Composition id="RRR" component={Campaign} {...video} />;
