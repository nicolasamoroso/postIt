const loadInitialTemplate = () => {
  const template = `
  <div class="container mt-5">
    <form id="postsIt-form" class="row">
      <div class="col-5">
        <label for="title">Titulo</label>
        <input type="text" id="title" name="title" class="form-control" />
      </div>
      <div class="col-5">
        <label for="content">Contenido</label>
        <input type="text" id="content" name="content" class="form-control" />
      </div>
      <div class="col-2 d-flex align-items-end">
        <button type="submit" class="btn btn-primary mt-3">Enviar</button>
      </div>
    </form>
    <div id="postit-list" class="row mt-5 gy-3"></div>
  </div>

  <div class="modal fade" id="modal" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="modalLabel">Modal title</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body gap-2">
          <label for="modalTitle">Titulo</label>
          <input type="text" id="modalTitle" name="modalTitle" class="form-control" />
          <label for="modalContent">Contenido</label>
          <input type="text" id="modalContent" name="modalContent" class="form-control" />
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" id="modalBtn">Save changes</button>
        </div>
      </div>
    </div>
  </div>
  `
  const body = document.getElementsByTagName('body')[0]
  body.innerHTML = template
}

const getPostsIt = async () => {
  const response = await fetch('/postsIt')
  const postsIt = await response.json()
  let template = ""
  postsIt.forEach(element => {
    template += `
    <div class="col-3">
      <div class="card">
        <div class="card-body">
          <div class="d-flex justify-content-end">
          <button type="button" class="btn-close" aria-label="Close" data-id="delete-${element._id}"></button>
          </div>
          <h5 class="card-title">${element.title}</h5>
          <p class="card-text">${element.content}</p>
          <button class="btn btn-primary" data-id="edit-${element._id}">Edit</button>
        </div>
      </div>
    </div>
    `
  });
  document.getElementById('postit-list').innerHTML = template

  postsIt.forEach(element => {
    const postItNode = document.querySelector(`[data-id="delete-${element._id}"]`)
    postItNode.addEventListener('click', async () => {
      await fetch(`/postsIt/${element._id}`, {
        method: 'DELETE'
      })
      getPostsIt()
    })
  })

  postsIt.forEach(element => {
    const postItNode = document.querySelector(`[data-id="edit-${element._id}"]`)
    postItNode.addEventListener('click', async () => {
      document.getElementById('modalTitle').value = element.title
      document.getElementById('modalContent').value = element.content

      const myModal = new bootstrap.Modal(document.getElementById('modal'))
      myModal.show()

      document.getElementById('modalBtn').addEventListener('click', async (e) => {
        const title = document.getElementById('modalTitle').value
        const content = document.getElementById('modalContent').value
        if (title && content) {
          await fetch(`/postsIt/${element._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              title,
              content
            })
          })
          getPostsIt()
        }
        else {
          alert('Los campos no pueden estar vacios')
        }
        myModal.hide()
      })
    })
  })
}

const addFormListener = () => {
  const postsItForm = document.getElementById('postsIt-form')
  postsItForm.onsubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(postsItForm)
    const data = Object.fromEntries(formData.entries())
    if (data.title && data.content) {
      await fetch('/postsIt', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      postsItForm.reset()
    }
    else {
      alert('Los campos no pueden estar vacios')
    }
    getPostsIt()
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadInitialTemplate()
  getPostsIt()
  addFormListener()
})
