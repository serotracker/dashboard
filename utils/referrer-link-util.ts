const safeReferrerLinkRegex = /^(\/[a-zA-Z0-9?=#]+)+$/

export const isSafeReferrerLink = (referrerLink: string) => {
  return safeReferrerLinkRegex.test(referrerLink);
}