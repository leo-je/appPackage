import express from 'express'
export interface PreComponentInterface {

    /**
     * @property {string} name
     */
    enable(app: express.Express): void;
}