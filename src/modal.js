export class VideoModal {
  constructor() {
    this.modalContainer = document.getElementById('detail-modal-container');
    this.modal = document.getElementById('detail-modal');
    this.title = document.getElementById('modal-title');
    this.video = document.getElementById('modal-video').querySelector('video');
    this.description = document.getElementById('modal-description');
    this.moreVideos = document.getElementById('modal-more-videos');
    document.getElementById('modal-close').onclick = () => {
      this.onClose();
    }
  }

  onClose() {
    this.video.pause();
    this.video.innerHTML = "";
    this.modalContainer.style.display = "none";
  }

  showModal(id, data) {
    if (!data) {
        return;
    }

    if (!data.title) {
        console.error(`Please specify a title for id ${id}!`);
        return;
    }

    this.setTitle(data);
    this.setVideo(data);
    this.setDescription(data);
    this.modalContainer.style.display = "block";
  }

  setTitle(data) {
    const title = data.title;
    const link = document.getElementById('modal-link');
    const linkTitle = link.querySelector('h2');
    const fallBackTitle = document.getElementById('modal-no-link');
    if (data.titleLink) {
      link.href = data.titleLink;
      linkTitle.innerHTML = title;
      link.style.display = "block";
      fallBackTitle.style.display = "none";
    } else {
      fallBackTitle.innerHTML = title;
      fallBackTitle.style.display = "block";
      link.style.display = "none";
    }
    this.video.load();
  }

  setVideo(data) {
    let videoLinks = data.video;

    if (videoLinks) {
      videoLinks = Array.isArray(videoLinks) ? videoLinks : [videoLinks];
      videoLinks.forEach(video => {
        const source = document.createElement('source');
        source.src = video;
        this.video.appendChild(source);
      })
      this.video.style.display = "block";
    } else {
      this.video.style.display = "none";
    }
  }

  setDescription(data) {
    const description = data.description;
    if (description) {
      const descriptionElement = document.getElementById('modal-description');
      descriptionElement.innerHTML = description;
    }
  }
}