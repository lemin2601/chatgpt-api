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
//__cf_chl_tk=cfPbqzHn8huOGK34h0q6daXcOasTZ7LzCq2qO8Jz7Do-1671786672-0-gaNycGzNCKU
async function main() {
  const email = process.env.OPENAI_EMAIL
  const password = process.env.OPENAI_PASSWORD

  let { sessionToken, clearanceToken } = {
    clearanceToken:
      'BBHOprTZe3qoDrerg4owgMz_91OjfSn_PFGURM_lUcg-1671793413-0-1-26d6bae3.222baa73.31ca379-160',
    sessionToken:
      'eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..xdxtqIzOXd75fl1G.2K-6WNyLpX__kww1hzRTvsiv7pgj7BB_YOkZratSic5_6HezoaSeA5P0xau8k0xtgyMSrim4ZzdhWvZq5k52xEQlfy26uDJZXhdTUp6U7xtVwkCBbGPXAOIElEQkFj9-LUDWnHgLWetm5mGVUuoB_ggVf1BYUSpIRRkgdIin9OXxicYDvZ1tacoBZ0Kpn6JTH9BZKh12_CyxoddWwjSBuqduG23a_1rvLDWwcddMis4Yv0SWm1FLZP4DGLwpyJ_IXo69eLU9RN2CTx-LHSiEB2qHUXr3PcWQ3LwRO-ttAhtHmJj03eo5FNEB1_skweapwPpSyiTE-gt-whJL4YG_5pigetS-I4fwn1FUEPNVHUJr3xL6TDKroFwZH_K0M2zZ__lNMktq4I8scBSZIFtdeaS1OXJL-pA8YHP_QwlPewQ4i7Vx-oOZbhxTVNXpqOas4Xd-ADC8upm0v_vCPg7Le9DPQse0bKk4enexw-VP9MhB1UQVIa4PVLAyrFnc9nGGUco6yA6YD7HbNhMPYXj4nmFGzmhwPs6XaKkeSFs9WM-kFY36SbEI190f17Js9PdmzWT3wEcppW2Wl4QGoIj3zvGNteXiAqslkEp8bzZG0XLnf5wbDT6YVMKcZH1n1BT7H5BYfAaiMuxj157grZ4h7gF8TeAxWPdKdne8NE5I2OW-zPuT00NHh_wBlnDJbaw2LoT4PgrhI-AvmKjs2xrHZBDtW7ilQA1f4YGR11LU5g2eZk-PVGXqhjMuWTgVCIXsHe1gAjy0dN9USdfcMuulSquMGzglxhciNndpR3DolZe8RiImVD6z7et7JzmbHEY4UyDqvMfrS0Z0diaFE_FzqmBGw6bfTOQM3dGhmUgii1TMgNyWFTyDA6Xdt_UQYrbMVzeE6aSQqh0ffxjc_z8OCv2msAbDryl-agFP_L1kL5c_f1HiNtU_A74byksScnLMkyycV5U9LODAhZhpMGoI1QdWxLfQwOsh9Z-rknMjImqawkd3JWjQGne9mBD5bQIEu0kekbyJm7D4qHhj4hNxG3lqlTq0TIJm3B7bDKe4thZX4yduYV-OmzC4JM3jiSQtisY0wuzHRoAcASVHPb2kMOYx1bVXqhQseWtBIHhth2MJqX9WrBUb9-EWfuPG1FgXow9cGZ1j07Eek5BDzpPqfXA0OfI5eO_MdMbqk7JezvXLwUMvljbU9xWp4R__hCYHXUQ3vw1F0Z7NUihdxM0luMGs9T7BxGDy6LED1SzkzQudpimCvRCMfEgJexaRi5FYCpSiGrDWv17vsJTI8rRuGxYBiFLDU9qva4l9Opx01ow21k6CPgoXGJtGIQwP26HB-geuCziGtHUsPvWUdQv-OntwlYORP-2czBeQUCtYVFFlnZFAeqU8GnhqJDMTGGM3Nt9u7_yP6ch54QSGU0IP4sxhbkX-haXCrT6k6Om39xEZcF9O25nRORPDrtBeLOz-vmsKk5W6bleUIJ26qEwPZ-3WR9HQhHka2IRktSseE6T6jO5FC0Y-WC4rXY4DFeO10KLU5lQNcsCy2rsj08ftxYC6DStUK9fD2FFkI4G1GW4xcKpHuK2xLxv8I53i8APALjka88_DzD3fCLIqwgZFpMASu5CN8w3DrshVSxsWKSQdsbuYi-ERqcyKxH0JwstT5Rb28vZq8ONuZ2CNNxeo4LlCZjEVqJK1ck1LP_BII0PeOvWUP7LZ9TPaTI6AoiaL_-Pd_C5fqZkT17JYixPbteM8wSyTjJSL_DaE6pOsOPNHAs1ZaHdaWFxIJSC5Vs6D643wcEj8WjUeD-iGqcIB27E1w6kfkqU6BsGHbbC3MgYCZHNtlef-SJE10yMAsWnyauLJ2UTq_hgTSPnXkCxxQvG1iXTrLdq6JBjq5BrHYdXSkmXWngiIpxuiOK2uLQFDguF2XQuSJLGNZuzSuqKY0JjUtCx7sDAeskm-1jdXjr3KfgtXcwX5zzdS0YJ-KNN7Xu2HHa9a4TsYgCYLBZB6n0ziKfAkGUIOzmQDfAfyAFv8Czchcnaz4JYfTcApnPFmgG39N-gsLB7aCWN7a77-UYMWk4OGZimsl0vTBInvJzAJ-O21B-XpdnoCnWUIhTkZciMiRRBc-JcdM6b5MjwiZQUdsdSDrlfRtd-2HiVCsR3csM90vWxroSlxV7BdousY_oHOsoQKJsiG0QGn630uysfRsMk8M2VzB-aR8dOab83Kd3u0mnZt1-F1k6NhZBeEq27XWAn5vIFAtkNIhKrbUdQUe3xpa-Rt1MRF87NhtrKNYVkhEh1AVXfCm6oAHbps07rZwv648m--XGdzFgjNPSktOJp3J9mvHNfWbjJh-zA_1kp3Fc1EsnCdIss.TPnlNzP4wicMUbao3BEq7Q'
  }
  let time = Date.now()
  const api = new ChatGPTAPIBrowser({
    email,
    password,
    debug: false,
    minimize: false,
    executablePath: process.env.PATH_CHROME,
    sessionToken,
    clearanceToken
  })
  console.log(new Date(), Date.now() - time, 'ChatGPTAPIBrowser done')
  let tryConnect = true
  while (tryConnect) {
    console.log('try connect ....')
    try {
      console.log(new Date(), 'init step 1', 'initSession')
      await api.initSession()
    } catch (e) {
      console.log(e)
    }
    tryConnect = !(await api.getIsAuthenticated())
  }
  console.log(new Date(), 'init step final', 'success run', Date.now() - time)

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

  console.log(new Date(), 'send 1', 'alo')
  // const prompt0 = 'Write a python version of bubble sort. Do not include example usage.'
  let prompt0 = 'alo'
  let res = await oraPromise(
    api.sendMessage(prompt0, {
      timeoutMs: 0,
      onProgress: (result) => {
        console.log(new Date(), 'send 1', 'alo', 'onProgress', result.response)
        // console.log(new Date(), 'onProgress ', result)
      }
    }),
    {
      text: prompt0
    }
  )
  console.log(new Date(), 'send 1', 'alo', 'done', res.response)

  console.log(new Date(), 'f5 1', 'starting ...')
  let page = api.getPage()
  // await page.setCacheEnabled(false);
  try {
    await api.refreshSession()
    // await page.reload({waitUntil: 'networkidle2'});
  } catch (e) {
    console.error(e)
  }
  console.log(new Date(), 'f5 1', 'done')
  // await api.resetSession()//load lai trang
  await api.refreshSession()

  console.log(new Date(), 'send 1', 'xin chào', 'send')
  prompt0 = 'xin chào'
  res = await oraPromise(
    api.sendMessage(prompt0, {
      timeoutMs: 0,
      onProgress: (result) => {
        console.log(
          new Date(),
          'send 1',
          'xin chào',
          'onProgress',
          result.response
        )
      }
    }),
    {
      text: prompt0
    }
  )
  console.log(new Date(), 'send 1', 'xin chào', 'done', res.response)

  console.log(new Date(), 'f5 1', 'starting ...')
  page = api.getPage()
  // await page.setCacheEnabled(false);
  try {
    await page.reload({ waitUntil: 'networkidle2' })
  } catch (e) {
    console.error(e)
  }
  console.log(new Date(), 'f5 1', 'done')
  // const prompt = 'Write a poem about cats.'
  //
  // res = await oraPromise(api.sendMessage(prompt), {
  //   text: prompt
  // })
  //
  // console.log('\n' + res.response + '\n')
  //
  // const prompt2 = 'Can you make it cuter and shorter?'
  //
  // res = await oraPromise(
  //   api.sendMessage(prompt2, {
  //     conversationId: res.conversationId,
  //     parentMessageId: res.messageId
  //   }),
  //   {
  //     text: prompt2
  //   }
  // )
  // console.log('\n' + res.response + '\n')
  //
  // const prompt3 = 'Now write it in French.'
  //
  // res = await oraPromise(
  //   api.sendMessage(prompt3, {
  //     conversationId: res.conversationId,
  //     parentMessageId: res.messageId
  //   }),
  //   {
  //     text: prompt3
  //   }
  // )
  // console.log('\n' + res.response + '\n')
  //
  // const prompt4 = 'What were we talking about again?'
  //
  // res = await oraPromise(
  //   api.sendMessage(prompt4, {
  //     conversationId: res.conversationId,
  //     parentMessageId: res.messageId
  //   }),
  //   {
  //     text: prompt4
  //   }
  // )
  // console.log('\n' + res.response + '\n')

  // await api.closeSession()
  // close the browser at the end
  // await api.closeSession()
}

main().catch((err) => {
  console.error(err)
  // process.exit(1)
})
