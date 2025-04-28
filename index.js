const giftBox = document.getElementById("giftBox");
const message = document.getElementById("message");
const birthdayText = document.getElementById("birthdayText");
const birthdayMusic = document.getElementById("birthdayMusic");
const flame = document.getElementById("flame");
const txt = document.querySelector("h1"); // Giả sử bạn có thẻ <h1> để đổi lời chúc
const candle = document.getElementById("candle"); // Nến

const texts = [
  "Chúc bà Thy sinh nhật vui vẻ nhé, tuổi mới thêm nhiều niềm vui mới 🥳🔥",
  "Cầu gì được nấy, cầu tiền được tiền, cầu tình được tình, cầu tài được tài  😎✨",
  "Happy Birthday, mãi vui nhe, chúc bà sống mãi trong ánh sáng 10 chương kinh Phật🎁🎉",
];

let flameOff = false; // Kiểm tra xem nến đã tắt hay chưa
// pháo hoa
// hiệu ứng pháo hoa liên tục
startConfetti();
function startFireworks() {
  setInterval(() => {
    const f = document.createElement("div");
    f.classList.add("firework");
    f.style.left = Math.random() * 100 + "vw";
    f.style.top = Math.random() * 50 + "vh";
    document.getElementById("fireworks").appendChild(f);
    setTimeout(() => f.remove(), 1000);
  }, 300); // cứ mỗi 300ms lại tạo ra một pháo hoa mới
}

// hiệu ứng confetti liên tục
function startConfetti() {
  setInterval(() => {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");
    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.top = Math.random() * 100 + "vh";
    confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 60%)`;
    confetti.style.animation = `fall ${3 + Math.random() * 2}s linear`;
    document.body.appendChild(confetti);
    // Sau 3s, loại bỏ confetti đã tạo ra
    setTimeout(() => confetti.remove(), 3000);
  }, 100); // cứ mỗi 100ms lại tạo ra một confetti mới
}

// Xử lý click vào giftbox
giftBox.addEventListener("click", () => {
  giftBox.style.display = "none"; // Ẩn giftbox

  // Phát nhạc

  // Lắng nghe âm thanh từ micro để tắt nến
  listenMicrophone();

  // --- Phần từ main.js --- //
  // Xử lý hiệu ứng tắt lửa và đổi text khi có âm thanh
  if (!flameOff) {
    // Đảm bảo message chưa hiển thị cho đến khi nến tắt
    message.style.display = "none";
  }
});

// Hàm lắng nghe âm thanh từ micro
function listenMicrophone() {
  if (!navigator.mediaDevices) {
    alert("Trình duyệt không hỗ trợ microphone");
    return;
  }

  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then(function (stream) {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const microphone = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      microphone.connect(analyser);
      analyser.fftSize = 512;
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      function detectSound() {
        analyser.getByteFrequencyData(dataArray);
        const volume = dataArray.reduce((a, b) => a + b) / dataArray.length;

        // Nếu âm lượng vượt ngưỡng, tắt lửa và hiển thị message
        if (volume > 30 && !flameOff) {
          // Tắt nến
          flame.classList.remove("burn");
          flame.classList.add("puff");
          const smokes = document.querySelectorAll(".smoke");
          smokes.forEach((smoke) => {
            smoke.classList.add("puff-bubble");
          });
          birthdayMusic.play();

          const glow = document.getElementById("glow");
          if (glow) glow.remove();

          // Đổi chữ chúc
          txt.style.display = "none";
          setTimeout(() => {
            txt.innerHTML = "JOYEUX ANNIVERSAIRE";
            txt.style.display = "block";
          }, 750);

          candle.style.transition = "opacity 0.1s";
          candle.style.opacity = 0.5;

          // Chỉ hiển thị message sau khi tắt lửa
          setTimeout(() => {
            message.style.display = "block";
            typeWriter(texts, birthdayText);
          }, 1000); // Chờ 1 giây để hiệu ứng tắt nến diễn ra

          flameOff = true; // Đảm bảo chỉ tắt nến một lần
          stream.getTracks().forEach((track) => track.stop()); // Ngưng microphone sau khi đã tắt nến
        } else {
          requestAnimationFrame(detectSound);
        }
      }

      detectSound();
    })
    .catch(function (err) {
      console.error("Microphone error: ", err);
    });
}

// Hàm typewriter như cũ
function typeWriter(texts, element, textIndex = 0, i = 0) {
  if (textIndex < texts.length) {
    const text = texts[textIndex];
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      setTimeout(() => typeWriter(texts, element, textIndex, i + 1), 40);
    } else {
      setTimeout(() => {
        element.innerHTML += "<br>";
        typeWriter(texts, element, textIndex + 1);
      }, 2000);
    }
  }
}
