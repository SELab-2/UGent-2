import {JSX} from "react";
import {Chart} from "react-google-charts";


export default function Statistics(): JSX.Element {
    const data = [
        ["Indieningen", "Aantal leerlingen"],
        ["SUCCES", 11],
        ["FAIL", 2],
        ["NOTHING YET", 2],
    ];
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
                        <Chart
                            chartType="PieChart"
                            data={data}
                        />
                    </section>
                    <footer className="modal-card-foot"/>
                </div>
            </div>
        </>
    )
}