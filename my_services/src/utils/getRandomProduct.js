
export function getRandomProduct(arr,count)
{
    let copy = [...arr];

    for(let i = copy.length-1; i>0; i--)
    {
        let j = Math.floor(Math.random()*(i+1));
        [copy[i], copy[j]] = [copy[j], copy[i]]
    }
    return copy.slice(0,count);
}