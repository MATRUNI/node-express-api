
export function makeSlug(name='')
{
    return name.trim().toLowerCase().replace(/\s+/g, '-')+'-'+Date.now();
}

export function makeSKU()
{
    return `SKU-${Date.now()}-${Math.floor(Math.random()*1000)}`
}