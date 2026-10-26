
export function getRandomProduct(arr,count)
{
    const n = arr.length;
    const k = Math.min(Math.max(0, Math.floor(count)), n);

    const selected = new Set();

    while (selected.size < k) {
        selected.add(Math.floor(Math.random() * n));
    }

    return [...selected].map(index => arr[index]);
}