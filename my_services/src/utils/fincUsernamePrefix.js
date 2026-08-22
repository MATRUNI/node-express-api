function compareStrings(a, b) {
    return a.localeCompare(b,undefined,{
        sensitivity:"base"
    });
}

export function findUsernamePrefix(usernames, prefix) {
    const normalizedPrefix = prefix.toLowerCase();

    let left = 0;
    let right = usernames.length;

    while (left < right) {
        const middle = Math.floor((left + right) / 2);
        const username = usernames[middle].toLowerCase();

        if (compareStrings(usernames[middle], prefix) < 0) {
            left = middle + 1;
        } else {
            right = middle;
        }
    }

    const matches = [];

    for (let i = left; i < usernames.length; i++) {
        const username = usernames[i];

        if (!username.toLowerCase().startsWith(normalizedPrefix)) {
            break;
        }

        matches.push(username);
    }

    return matches;
}
