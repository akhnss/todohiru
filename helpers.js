exports.flattenArray = arr => arr.reduce((a, b) => a.concat(b), [])

exports.getContents = async (context, file) => {
  const {data} = await context.github.repos.getContent(context.repo({
    path: file,
    ref: context.payload.after
  }))

  const decoded = await Buffer.from(data.content, 'base64').toString()
  return decoded
}

/**
 * Generate a body string for the new issue.
 * @param {string} title - Issue title
 * @param {string} file - File name
 * @param {string} contents - Contents of the file
 * @param {string} author - Author of the commit
 * @param {string} sha - Commit where this todo was introduced
 * @param {number} [pr] - PR number if applicable
 *
 * @todo Include code blob
 */
exports.generateBody = (title, file, contents, author, sha, pr) => {
  const re = new RegExp(`${title}\n.*@body (.*)`, 'gim')
  const bodyRe = re.exec(contents)
  const body = bodyRe ? bodyRe[1] : ''
  return `
${body}

---

###### This issue was generated by [todo](https://github.com/jasonetco/todo) based on a \`@todo\` comment in ${sha}${pr ? ` in #${pr}` : ''}. It's been assigned to @${author} because they committed the code.
`
}