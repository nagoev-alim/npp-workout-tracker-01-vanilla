import feather from 'feather-icons';
import { uid } from '../modules/uid.js';

/**
 * @class App
 */
export default class App {
  constructor(root) {
    this.root = root;
    this.entries = this.storageGet();

    this.root.innerHTML = `
    <h3 class='title'>Workout Tracker</h3>
    <div class='header'>
      <div>Date</div>
      <div>Workout</div>
      <div>Duration</div>
    </div>
    <div class='main'></div>
    <div class='footer'>
      <button>Add Entry</button>
    </div>`;

    this.updateView();
    this.root.querySelector('.footer button').addEventListener('click', this.onSubmit);
  }

  /**
   * @function onSubmit - Create new entry
   */
  onSubmit = () => {
    this.entries.push({
      date: `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${new Date().getDay().toString().padStart(2, '0')}`,
      workout: 'walking',
      duration: 30,
      id: uid(),
    });
    this.storageSet();
    this.updateView();
  };

  /**
   * @function updateView
   */
  updateView() {
    const body = this.root.querySelector('.main');

    body.querySelectorAll('.row').forEach(row => row.remove());

    for (const entry of this.entries) {
      const row = document.createElement('div');
      row.classList.add('row');
      row.innerHTML = `
        <div class='date'>
          <input type='date'>
        </div>
        <div class='type'>
          <select>
              <option value='walking'>Walking</option>
              <option value='running'>Running</option>
              <option value='outdoor-cycling'>Outdoor Cycling</option>
              <option value='indoor-cycling'>Indoor Cycling</option>
              <option value='swimming'>Swimming</option>
              <option value='yoga'>Yoga</option>
          </select>
        </div>
        <div class='duration'>
          <div>
            <input type='number'>
            <span>minutes</span>
          </div>
          <button data-id='${entry.id}'>${feather.icons.x.toSvg()}</button>
        </div>
      `;

      const fieldDate = row.querySelector('[type="date"]');
      const fieldSelect = row.querySelector('select');
      const fieldNumber = row.querySelector('[type="number"]');
      const buttonDelete = row.querySelector('button');

      fieldDate.value = entry.date;
      fieldSelect.value = entry.workout;
      fieldNumber.value = entry.duration;

      fieldDate.addEventListener('change', ({ target: { value } }) => {
        entry.date = value;
        this.storageSet();
      });

      fieldSelect.addEventListener('change', ({ target: { value } }) => {
        entry.workout = value;
        this.storageSet();
      });

      fieldNumber.addEventListener('change', ({ target: { value } }) => {
        entry.duration = value;
        this.storageSet();
      });

      buttonDelete.addEventListener('click', ({ target: { dataset: { id: rowID } } }) => {
        if (confirm('Are you sure you want to delete it?')) {
          this.entries = this.entries.filter(({ id }) => id !== rowID);
          this.storageSet();
          this.updateView();
        }
      });

      body.appendChild(row);
    }
  }

  /**
   * @function storageGet
   * @returns {any|*[]}
   */
  storageGet = () => {
    return JSON.parse(localStorage.getItem('workout')) || [];
  };

  /**
   * @function storageSet
   */
  storageSet = () => {
    return localStorage.setItem('workout', JSON.stringify(this.entries));
  };
}


