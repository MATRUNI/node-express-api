export function findUsernamePrefix(users, prefix) {
  const normalizedPrefix = prefix.trim().toLowerCase();

  if (!normalizedPrefix) {
    return [];
  }

  let left = 0;
  let right = users.length;

  while (left < right) {
    const middle = Math.floor((left + right) / 2);

    if (
      users[middle].username.toLowerCase() < normalizedPrefix
    ) {
      left = middle + 1;
    } else {
      right = middle;
    }
  }

  const matches = [];

  for (let i = left; i < users.length; i++) {
    const username = users[i].username;

    if (!username.toLowerCase().startsWith(normalizedPrefix)) {
      break;
    }

    matches.push(users[i]);
  }

  return matches;
}

