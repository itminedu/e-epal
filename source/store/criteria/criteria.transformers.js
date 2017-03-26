"use strict";
function deimmutifyCriteria(state) {
    let fetchedCriteria = new Array();
    state.forEach(criteria => {
        fetchedCriteria.push({ id: criteria.id, name: criteria.name, mutual_disabled_id: criteria.mutual_disabled_id, selected: criteria.selected,
        });
    });
    return fetchedCriteria;
}
exports.deimmutifyCriteria = deimmutifyCriteria;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JpdGVyaWEudHJhbnNmb3JtZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY3JpdGVyaWEudHJhbnNmb3JtZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFFQSw0QkFBbUMsS0FBYztJQUM3QyxJQUFJLGVBQWUsR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDO0lBRWxDLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUTtRQUNsQixlQUFlLENBQUMsSUFBSSxDQUFZLEVBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUcsa0JBQWtCLEVBQUUsUUFBUSxDQUFDLGtCQUFrQixFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsUUFBUTtTQUNuSixDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztJQUNILE1BQU0sQ0FBQyxlQUFlLENBQUM7QUFDM0IsQ0FBQztBQVJELGdEQVFDO0FBQUEsQ0FBQyJ9