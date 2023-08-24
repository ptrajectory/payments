
/**
 * @name sleep
 * @description makes the thread sleep for a given amount of time
 * @param ms 
 */
async function sleep(ms: number){
    const timeout = new Promise((res)=>{
        setTimeout(()=>{
            res(null)
        }, ms)
    })
    await timeout
}


export {
    sleep
}

