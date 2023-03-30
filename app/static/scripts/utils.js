async function sendDeleteCardSetRequest(cardSetId) {
  const response = await fetch(`/api/delete-cardset/${cardSetId}`, { method: "GET"})
  const json = await response.json()
  if (response.ok) {
    return json
  }
  throw new Error(json.error)
}

async function sendSaveCardSetRequest(cardSetId) {
  const response = await fetch(`/api/save-cardset/${cardSetId}`, { method: "GET" })
  const json = await response.json()
  if (response.ok) {
    return json
  }
  throw new Error(json.error)
}

async function sendDeleteFlashcardRequest() {

}
