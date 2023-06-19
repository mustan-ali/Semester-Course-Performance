let dataApp = () => {
    return {
        page: 0,
        key: "",
        data: { student: [], recap: [], register: [], result: [], heads: [], grade: [] },
        getData(id) {
            this.page = id;
            this.key = id === 1 ? "student" : id === 2 ? "recap" : id === 3 ? "register" : id === 4 ? "result" : id === 5 ? "heads" : id === 6 ? "grade" :"";
            if (this.data[this.key].length === 0) {
                fetch(`/data/${this.page}`)
                    .then((response) => response.json())
                    .then((json) => {
                        this.data[this.key] = json.rows;
                        console.log(this.data[this.key]);
                    });
            }
        },
    };
};
