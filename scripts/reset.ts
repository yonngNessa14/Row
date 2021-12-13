/**
 * Copyright (c) 2019 Jonathan Andersen
 * Copyright (c) 2019 William R. Sullivan
 *
 * This software is proprietary and owned by Jonathan Andersen.
 *
 * This software was based on https://github.com/wrsulliv/NodeStarter,
 * licensed under the MIT license.
 */

import { elastic } from '../src/elastic';
import { InfoParams, CatIndicesParams } from 'elasticsearch';
const readline = require('readline');

//  Set up readline.
//  REFERENCE:  https://nodejs.org/api/readline.html
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const start = async () => {

  //  Get Server Info
  const infoParams: InfoParams = {};
  const info = await elastic.info(infoParams);

  //  Delete the Indices
  console.log(JSON.stringify(info, undefined, 2));
  rl.question(`Delete ALL or just DOCS?`, async (answer: unknown) => {
    rl.close();
    if (answer === 'ALL') {
      //  Get All Indices
      const catParams: CatIndicesParams = { v: true, format: 'json' };
      const indices = await elastic.cat.indices(catParams);

      //  Iterate the List to Delete All Indices
      //  NOTE:  Bonsai does not support 'elastic.indices.delete({ index: "_all" });'
      for (let i = 0; i < indices.length; i++) {
        const index = indices[i];
        const indexName = index.index;
        await elastic.indices.delete({ index: indexName });
      }
    } else if (answer === 'DOCS') {
      //  Get All Indices
      const catParams: CatIndicesParams = { v: true, format: 'json' };
      const indices = await elastic.cat.indices(catParams);

      //  Iterate the List to Delete All Documents
      for (let i = 0; i < indices.length; i++) {
        const index = indices[i];
        const indexName = index.index;
        if (indexName === 'user') {
          // Only delete "coach_" users created by the simulator
          await elastic.deleteByQuery(
            {
              index: indexName,
              body: {
                query: {
                  bool: { should: [
                      { regexp: { username: "coach_[0-9]" }},
                      { regexp: { username: "member_.*" }}
                  ]}
                }
              }
            });
        } else {
          await elastic.deleteByQuery({ index: indexName, body: { query: { match_all: {} } } });
        }
      }
    } else {
      throw new Error('Cancelled the Operation');
    }
  });
};

start();
