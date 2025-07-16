// In-browser Firestore mock using localStorage for MVP prototyping.

class FirestoreMock {
  constructor() {
    this.data = {};
    this.loadData();
    // Add this block below:
    if (!this.data.incidents || this.data.incidents.length === 0) {
      this.data.incidents = [
        {
          id: "mock_initial1",
          type: "fight",
          location: { lat: 51.505, lng: -0.09, name: "Lagoon Front" },
          description: "Physical altercation detected",
          status: "reported",
          severity: 4,
          timestamp: new Date(Date.now() - 120000)
        }
      ];
      this.saveData();
    }
  }
  
  saveData() {
    localStorage.setItem('firestore_mock', JSON.stringify(this.data));
  }

  collection(name) {
    return {
      add: (doc) => {
        if (!this.data[name]) this.data[name] = [];
        doc.id = `mock_${Math.random().toString(36).substr(2, 9)}`;
        this.data[name].push(doc);
        this.saveData();
        return Promise.resolve({ id: doc.id });
      },
      where: () => ({
        orderBy: () => ({
          get: () => Promise.resolve({
            docs: this.data[name]?.map(doc => ({
              id: doc.id,
              data: () => doc
            })) || []
          })
        })
      })
    };
  }

  doc(path) {
    const [collection, id] = path.split('/');
    return {
      update: (data) => {
        const index = this.data[collection]?.findIndex(d => d.id === id);
        if (index >= 0) {
          this.data[collection][index] = { ...this.data[collection][index], ...data };
          this.saveData();
          return Promise.resolve();
        }
        return Promise.reject(new Error('Document not found'));
      }
    };
  }
}

// Singleton instance
const firestore = new FirestoreMock();

// Mock Firebase initialization
const initializeApp = () => ({
  firestore: () => firestore
});



export { initializeApp, firestore };
