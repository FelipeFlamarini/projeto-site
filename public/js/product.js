<% for (let i = 0; i < imgs.length; i++) { %>
    document.getElementById("img<%= i %>").onclick = function() {changeMainImage(<%= i %>)};
<% } %>

function changeMainImage(imageNumber) {
    document.getElementById("mainImage").src="<%= imgsPath%>" + imageNumber + ".png";
}