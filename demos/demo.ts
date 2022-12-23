import dotenv from 'dotenv-safe'
import { oraPromise } from 'ora'

import { ChatGPTAPIBrowser } from '../src'

dotenv.config()

/**
 * Demo CLI for testing basic functionality.
 *
 * ```
 * npx tsx demos/demo.ts
 * ```
 */
async function main() {
  const email = process.env.OPENAI_EMAIL
  const password = process.env.OPENAI_PASSWORD

  let sessionToken =
    'eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..fKgcBblZk8gdZOtx.aEzvu7nyHz8TcoEa5R1CU8MzwL5sJ_0hqU0P3k43d9t_fehs3huKXQxSNPFF6Je91L1PcI0EiZb6U212gPuCHwZxNYa3_BHQbIW1ZYeLmIE14-OpdGGTIBfzAmqnDdFY07Qn3XyahOORGyrOU8goyDT6iDPOJVWRP2s0R9lqB9NnRO7iO7C8AmxHx85Ipam_I9UWN8z9ov1O5u5P5EKpQX3E8KtreBlONm_41b1XXkja1pkj8smhBxbeOfcUr9bBj9-oTQdXJfAURJbUaqtomV6boptxDZ2K66BgLnX3Eb57ivaH2hTJAN2iQPFjT_VcoJhSCyHhl2kRzqEYxsLxp4qmUNqWECTiDwXll4lUzynYzhDLEvN-F9mmCcqEf-ASPaDml5x3gniY4iwmaWb95JoYz11vsZnu-ZiNtm6Z2duc5VEUPBzxdZUigF5Va18ZbgdHN9iSZlADXWA9BBG6eJ-3pYWTBv7PWcY_C3KuAmaVbR9APWsPRv9R_2X0Dwr11uFiHlFgXk6lg8v6As7CqL6MbcWXZ0WMy4Uf_3jwIXJzzb571FjoLAVcu2XgC4lqvldDwWizjWuJCpWA3ihZCBt7zhGZHQIZtPjQPuqm_QGhr6RQ8A7PJIXN3t4Dc6pWX3Ih8gk6aTcM_IJRcXivtAecXUbV62ahvhEOwRmBS9DGRivpf6TtbtKF1TS3eFRCBayqIQrIkuVBdWobR7EyaS4nKJnk07fMsBc752QzZOzFdxkpLBJJdi0MokBE7HEKEo7J1atlalztfmO1ZiiQVV62_PbWvTDsPgpLngLHpuEqmKBVd9NNFqb-tPFkxTrp7sgsgp3FvO_DOtqlQa3i-q_yr7Nw3CspzcFuGZDIoAssFh3aAyvfMxcbvDMnqw3QYZSzlrFqSCJrmS8rzvc5NJwKV1KPKPChzFRSDtm5zEZcpqtg57O-B5DUf2C_giPWjxtCzMfvJ9AGbY4w7XN-8TR3ccoi60LC2f7eLCVYs30CEzfRjVul9F6SnLYY_Uo8Kpb-Z9En5RCGIi8Mq1dj2IUuAmkFDrGhkkdGU_-YP9SCZiF_GnuKp8LMDXEvdUnrJkHuXnBl9vsMopPzk7K105quxrnhBNebMhSxfEX8ht3SHXhsu2fRExfkPPSf0duJ-qu16rIBTGDmP67ZNTTXqQYh14mm6dnetE6V0U2JCz1S4CoyBvwm7j90BBTZ6P0NPxNKfCbFZBqFL7eL1G7ZH5pvg_OnpYkhiKZ7Mjuf6Hv-Lu9PjT8QuF3JYW-qkqHWDXl-rupaRF-fxp_rnPEG1nW4vgsgeFvBN-qX6Wg5HEPFnzvTGoebEqLtQP8J_p64KOaFQB1ADLG16BLTfafebx8BK96PGdW_VUQ8BkuIcFinsuVKlPFoUY2I5BKX-uHWWrGgWF_HmDjl2_m2dpxFx7dskymh9oQyzCKE19ii4MrwnFfdGrBX9EOPJuE5ulxEyg9hbyILMDRMTRKJqT2Sw7F27XGy8TmDLsgg68GtVqIa9tb4Jvo94WNGbVx2-hWqITtO3P8PF8xLjRKFUsOC8v7WRenOG0LoE1rhbX-TTaODNhtVuMS8Xn6JR1CyqKvuQ0YstyDsncVSoJa_A9ymeVA653HAs1y4n5WfQ2aXeYC-Qt7albXJeQs4O9AmxdoeIuLC45VD7i5q6k-gA9k_2Qgv15ndKigyucazuVS62OviDGSklzm-9NXmhznTVefqApg-4ZyVUKeIfSquADUgddtTIEXGmT3XMxWXFoGd91OvJNNczPznyeQ_eBBwWsmrfEEM6K25KjIKzMnvZOYJQnybA7P2cMVatqK-qKqcyjXLt4ha2iJMWdFCZ4tW45hYMWS7KrhbWHV6ehffzPDLIIAPica5wEVqpUiD3RzSpflRzEHrU_X9P81v96Avyze5SgrNvQKg7_cHeVwHblvtawkL_RDTlyGduUZ83E3PMMeBlt7PWvoaLAXBlYGavJkewXJXdotYCnmS5BWlE95nLJqNdGA61f_T288zUEnB0wjJ0elnf0mC_XAoxFcaSyk5oBsIX7AGPXQA1xmQ7H_RhnUQFNgfnwmw0AU6bUgHe0Sto8xLzme6XwwnDsb6uGv4uor8UR0xav7UvCxmLYnMzsN2McQA42DMDSYIruXkf7MdIuouHQ6fQnxX88BVElfcPMQDer3MuaEl59Jv6gvgHfGizlKmF9rOY1EEpXbOfg7OiGTU--e0cnLoBMZFE_Gyyg2fPVOQtLGR1Jeknt8qqGuzEA79mKha3t2vIZ9VwyC7MDIFTaTXDfDurQm8i0XJtpWSAiN3WtfKwegeGteMGQOGhqSYaiiR7kMNz588T5XUbEQ1hFkIBMLJ49o.2Tb83r8Hpcc7Lo7IoVZqDQ'
  let clearanceToken =
    'l_r5juobBCHUnDO4F.B_YZm_CAGGG3PBvYQzt6FAsj0-1671775027-0-1-26d6bae3.222baa73.31ca379-160'
  let time = Date.now()
  const api = new ChatGPTAPIBrowser({
    email,
    password,
    debug: false,
    minimize: true,
    executablePath: process.env.PATH_CHROME,
    sessionToken,
    clearanceToken
  })
  console.log(new Date(), Date.now() - time, 'ChatGPTAPIBrowser done')
  try {
    await api.initSession()
  } catch (e) {
    console.log(e)
  }
  console.log(new Date(), Date.now() - time, 'initSession done')

  sessionToken = api.getSessionToken()
  clearanceToken = api.getClearanceToken()
  console.log(
    new Date(),
    Date.now() - time,
    JSON.stringify(
      {
        clearanceToken: clearanceToken,
        sessionToken: sessionToken
      },
      null,
      2
    )
  )

  console.log(new Date(), 'initSession done')
  const prompt0 =
    'Write a python version of bubble sort. Do not include example usage.'

  let res = await oraPromise(
    api.sendMessage(prompt0, {
      timeoutMs: 0
      // onProgress: (result)=>{
      //   // console.log(new Date(), 'onProgress ', result)
      // }
    }),
    {
      text: prompt0
    }
  )
  console.log(new Date(), res.response)

  const prompt = 'Write a poem about cats.'

  res = await oraPromise(api.sendMessage(prompt), {
    text: prompt
  })

  console.log('\n' + res.response + '\n')

  const prompt2 = 'Can you make it cuter and shorter?'

  res = await oraPromise(
    api.sendMessage(prompt2, {
      conversationId: res.conversationId,
      parentMessageId: res.messageId
    }),
    {
      text: prompt2
    }
  )
  console.log('\n' + res.response + '\n')

  const prompt3 = 'Now write it in French.'

  res = await oraPromise(
    api.sendMessage(prompt3, {
      conversationId: res.conversationId,
      parentMessageId: res.messageId
    }),
    {
      text: prompt3
    }
  )
  console.log('\n' + res.response + '\n')

  const prompt4 = 'What were we talking about again?'

  res = await oraPromise(
    api.sendMessage(prompt4, {
      conversationId: res.conversationId,
      parentMessageId: res.messageId
    }),
    {
      text: prompt4
    }
  )
  console.log('\n' + res.response + '\n')

  await api.closeSession()
  // close the browser at the end
  // await api.closeSession()
}

main().catch((err) => {
  console.error(err)
  // process.exit(1)
})
