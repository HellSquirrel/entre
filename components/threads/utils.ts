export const blockThread = () => {
    console.log('blocking thread')
    let nextDivBy7 = 7;
    for (let i = 0; i < 1000000000; i++) {
        if (i % nextDivBy7 === 0) {
            nextDivBy7 = i;
        }
    }

    console.log('result is ', nextDivBy7)

    return nextDivBy7;
}