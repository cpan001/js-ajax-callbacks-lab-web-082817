$(document).ready(function() {
  addAllEventListeners();
});

const baseURL = "https://api.github.com/";
const token = "f10c565b0194e7a550437d2d7d75c2f1ca5cdea6";

function addAllEventListeners() {
  $("#searchForm").submit(searchRepositories);
  $("#results").on("click", showCommits);
}

function searchRepositories(event) {
  event.preventDefault();
  const term = $("#searchInput").val();
  const url = `${baseURL}search/repositories?q=${term}&sort=stars&order=desc`;
  fetch(url, {
    headers: { Authorization: `token ${token}` }
  })
    .then(handleErrors)
    .then(resp => resp.json())
    .then(json => {
      $("#results").html(renderRepos(json.items));
    })
    .catch(error => {
      $("#errors").text(error);
    });
}

function renderRepos(repos) {
  const reposHTML = `
  <ul>
    ${repos.map(repo => repoTemplate(repo)).join("")}
  </ul>`;
  return reposHTML;
}

function repoTemplate(repo) {
  const repoHtml = `
  <li><a href='${repo.html_url}' target='_blank'>${repo.name}</a>
  <ul>
    <li>Description: ${repo.description}</li>
    <li>Owner: ${repo.owner.login}</li>
    <li>Owner Profile Page: <a href='${repo.owner
      .html_url}' target='_blank'>Profile</a></li>
    <li>Owner Avatar: <img src=${repo.owner.avatar_url} height="80px"></li>
    <li><a href='${repo.commits_url.replace(
      "{/sha}",
      ""
    )}' target='_blank'>Show Commits</a></li>
  </ul></li>`;
  return repoHtml;
}

function showCommits(e) {
  e.preventDefault();
  if (e.target && e.target.text === "Show Commits") {
    fetch(e.target.href, {
      headers: { Authorization: `token ${token}` }
    })
      .then(handleErrors)
      .then(resp => resp.json())
      .then(json => {
        $("#details").html(renderCommits(json));
      })
      .catch(error => {
        $("#errors").text(error);
      });
  }
}

function renderCommits(commits) {
  const commitsHTML = `
  <ul>
    ${commits.map(commit => commitTemplate(commit)).join("")}
  </ul>`;
  return commitsHTML;
}

function commitTemplate(commit) {
  const commitHTML = `
  <li>${commit.sha}
    <ul>
      <li>Author: ${commit.committer.login}</li>
      <li>Author Image: <img src='${commit.committer
        .avatar_url}' height='80px'></li>
    </ul>
  </li>`;
  return commitHTML;
}

function handleErrors(response) {
  if (!response.ok) {
    throw response;
  }
  return response;
}
