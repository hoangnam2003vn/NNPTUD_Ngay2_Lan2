const API_URL = "http://localhost:3000/posts";

async function getPosts() {
  const res = await fetch(API_URL);
  return await res.json();
}

function renderPosts(posts) {
  const ul = document.querySelector("#postList");
  ul.innerHTML = "";

  posts.forEach((post) => {
    const li = document.createElement("li");

    li.textContent = `${post.id} - ${post.title} (views: ${post.views})`;

    if (post.isDeleted === true) {
      li.classList.add("deleted");
    }

    ul.appendChild(li);
  });
}

async function loadPosts() {
  const posts = await getPosts();
  renderPosts(posts);
}

// TÍNH ID MỚI = maxId + 1
function getNextId(posts) {
  let maxId = 0;

  for (const p of posts) {
    const numId = Number(p.id);
    if (!Number.isNaN(numId) && numId > maxId) {
      maxId = numId;
    }
  }

  return String(maxId + 1);
}

// TẠO POST MỚI (ID bỏ trống ở form, code tự set)
async function createPost(title) {
  const posts = await getPosts();
  const newId = getNextId(posts);

  const newPost = {
    id: newId,
    title: title,
    views: 0,
    isDeleted: false
  };

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newPost)
  });
}

document.querySelector("#btnAdd").onclick = async () => {
  const input = document.querySelector("#titleInput");
  const title = input.value.trim();

  if (!title) return;

  await createPost(title);
  input.value = "";
  await loadPosts();
};

loadPosts();
