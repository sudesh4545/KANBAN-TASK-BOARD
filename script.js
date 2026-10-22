(function () {
        "use strict";
        var cols = [
            ["todo", "To do"],
            ["doing", "In progress"],
            ["done", "Done"],
          ],
          items = [],
          $ = function (x) {
            return document.getElementById(x);
          },
          drag = null;
        try {
          items = JSON.parse(localStorage.getItem("flowdock:v1") || "[]");
        } catch (x) {}
        function save() {
          localStorage.setItem("flowdock:v1", JSON.stringify(items));
        }
        function draw() {
          $("board").innerHTML = "";
          cols.forEach(function (c) {
            var col = document.createElement("article");
            col.className = "panel column";
            col.dataset.col = c[0];
            var list = items.filter(function (x) {
              return x.col === c[0];
            });
            col.innerHTML =
              "<div class='head'><h2>" +
              c[1] +
              "</h2><span class='hint'>" +
              list.length +
              " TASKS</span></div><div class='tasks'></div>";
            list.forEach(function (x) {
              var d = document.createElement("div");
              d.className = "task";
              d.draggable = true;
              d.innerHTML =
                "<span class='p'>" +
                x.priority.toUpperCase() +
                "</span><b></b><small>Double-click to delete · drag to move</small>";
              d.querySelector("b").textContent = x.title;
              d.ondragstart = function () {
                drag = x.id;
              };
              d.ondblclick = function () {
                if (confirm("Delete this task?")) {
                  items = items.filter(function (a) {
                    return a.id !== x.id;
                  });
                  save();
                  draw();
                }
              };
              col.querySelector(".tasks").appendChild(d);
            });
            col.ondragover = function (e) {
              e.preventDefault();
              col.classList.add("over");
            };
            col.ondragleave = function () {
              col.classList.remove("over");
            };
            col.ondrop = function () {
              var x = items.find(function (a) {
                return a.id === drag;
              });
              if (x) x.col = c[0];
              save();
              draw();
            };
            $("board").appendChild(col);
          });
        }
        $("add").onclick = function () {
          var t = $("title").value.trim();
          if (!t) return;
          items.push({
            id: crypto.randomUUID(),
            title: t,
            priority: $("priority").value,
            col: "todo",
          });
          $("title").value = "";
          save();
          draw();
        };
        draw();
      })();
