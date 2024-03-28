import {JSX} from "react";
import {PieChart} from "react-minimal-pie-chart";

export default function Statistics(): JSX.Element {
    

    // default functie voor bulma modal gehaald van
    document.addEventListener('DOMContentLoaded', () => {
        // Functions to open and close a modal
        function openModal($el: HTMLElement | null) {
            if ($el === null) {
                return;
            }
            $el.classList.add('is-active');
        }

        function closeModal($el: Element | null) {
            if ($el === null) {
                return;
            }
            $el.classList.remove('is-active');
        }

        // Add a click event on buttons to open a specific modal
        (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
            const modal = "modal-stats"
            const $target = document.getElementById(modal);

            $trigger.addEventListener('click', () => {
                openModal($target);
            });
        });

        // Add a click event on various child elements to close the parent modal
        (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
            const $target = $close.closest('.modal');

            $close.addEventListener('click', () => {
                closeModal($target);
            });
        });
    });

    return (
        <>
            <button className="js-modal-trigger button is-primary" data-target="modal-stats">
                Statistieken
            </button>
            <div id="modal-stats" className="modal">
                <div className="modal-background"></div>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">Indieningen:</p>
                        <button className="delete" aria-label="close"></button>
                    </header>
                    <section className="modal-card-body">
                        <PieChart
                            data={[
                                {title: 'One', value: 10, color: '#E38627'},
                                {title: 'Two', value: 15, color: '#C13C37'},
                                {title: 'Three', value: 20, color: '#6A2135'},
                            ]}
                        />;
                    </section>
                    <footer className="modal-card-foot"/>
                </div>
            </div>
        </>
    )
}